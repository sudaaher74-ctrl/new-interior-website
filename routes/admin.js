const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Admin middleware
const authAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user.role !== 'Super Admin' && decoded.user.role !== 'Owner') {
        return res.status(403).json({ msg: 'Not authorized for this action' });
    }
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
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
    }).populate('user', 'fullName profilePhoto').populate('project', 'name coordinates');

    res.json(attendances);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
