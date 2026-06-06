const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Admin middleware (BYPASSED FOR LOGIN-FREE TESTING)
const authAdmin = async (req, res, next) => {
  try {
    const admin = await User.findOne({ email: 'admin@osinterior.com' });
    if (admin) {
      req.user = { id: admin._id, role: admin.role };
      next();
    } else {
      res.status(400).json({ msg: 'Admin not found. Please run seed script.' });
    }
  } catch (e) {
    res.status(500).json({ msg: 'Auth bypass error' });
  }
};

// Get Dashboard Stats
router.get('/stats', authAdmin, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'Ongoing' });
    const totalEmployees = await User.countDocuments({ role: 'Employee' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeesOnSite = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'Present'
    });

    res.json({
      totalProjects,
      activeProjects,
      totalEmployees,
      employeesOnSite,
      employeesAbsent: totalEmployees - employeesOnSite
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get Live Tracking Data (Employees who checked in today)
router.get('/live-tracking', authAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      date: { $gte: today },
      status: 'Present'
    }).populate('user', 'fullName profilePhoto').populate('project', 'name coordinates').lean();

    res.json(attendances);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
