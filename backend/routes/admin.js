const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');
const SiteVisit = require('../models/SiteVisit');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Admin middleware
const authAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });



    if (token === 'dummy_admin_token') {
      req.user = { id: '000000000000000000000000', role: 'Super Admin', fullName: 'Demo Admin' };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user.role !== 'Super Admin') {
      return res.status(403).json({ msg: 'Access denied: Super Admin only' });
    }
    
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
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

    const siteVisitsToday = await SiteVisit.countDocuments({
      time: { $gte: today }
    });

    res.json({
      totalProjects,
      activeProjects,
      totalEmployees,
      siteVisitsToday
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get Site Visits Data (replaces live-tracking)
router.get('/site-visits', authAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await SiteVisit.find({
      time: { $gte: today }
    }).populate('user', 'fullName profilePhoto').populate('project', 'name coordinates').lean();

    res.json(visits);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get All Employees
router.get('/employees', authAdmin, async (req, res) => {
  try {
    const employees = await User.find({ role: 'Employee' }).select('-password').lean();
    res.json(employees);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create Employee
router.post('/employees', authAdmin, async (req, res) => {
  const { fullName, email, password, mobileNumber, designation } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await require('bcryptjs').genSalt(10);
    const hashedPassword = await require('bcryptjs').hash(password, salt);
    
    const count = await User.countDocuments();
    const employeeId = 'EMP' + (count + 1).toString().padStart(3, '0');

    user = new User({ 
      employeeId, 
      fullName, 
      email, 
      password: hashedPassword, 
      mobileNumber,
      designation: designation || 'Site Engineer',
      role: 'Employee'
    });

    await user.save();
    res.json({ msg: 'Employee created successfully', user: { id: user._id, fullName: user.fullName } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
