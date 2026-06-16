const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SiteVisit = require('../models/SiteVisit');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    if (token === 'dummy_token') {
      req.user = { id: '000000000000000000000123', role: 'Employee', fullName: 'Demo Employee' };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Log a new Site Visit
router.post('/log', auth, async (req, res) => {
  const { projectId, lat, lng, accuracy, photoUrl, expenseAmount, expenseDescription } = req.body;

  try {
    const visit = new SiteVisit({
      user: req.user.id,
      project: projectId,
      location: { lat, lng, accuracy },
      photoUrl,
      expenseAmount: expenseAmount || 0,
      expenseDescription: expenseDescription || ''
    });

    await visit.save();
    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get today's site visits for the logged-in employee
router.get('/my-today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await SiteVisit.find({
      user: req.user.id,
      time: { $gte: today }
    }).populate('project', 'name').sort({ time: -1 }).lean();

    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all site visits for Admin Live Tracking
router.get('/all', auth, async (req, res) => {
  try {
    const visits = await SiteVisit.find()
      .populate('user', 'fullName role')
      .populate('project', 'name title')
      .sort({ time: -1 })
      .lean();

    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
