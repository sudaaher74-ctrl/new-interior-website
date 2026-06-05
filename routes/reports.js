const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const WorkReport = require('../models/WorkReport');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// Submit Daily Work Report
router.post('/', auth, async (req, res) => {
  const { projectId, workCompleted, materialUsed, workersPresent, issuesFound, clientFeedback, tomorrowPlan, media } = req.body;

  try {
    const report = new WorkReport({
      user: req.user.id,
      project: projectId,
      workCompleted,
      materialUsed,
      workersPresent,
      issuesFound,
      clientFeedback,
      tomorrowPlan,
      media
    });

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all reports (Admin)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'Super Admin' && req.user.role !== 'Owner') {
        return res.status(403).json({ msg: 'Not authorized' });
    }
    
    try {
        const reports = await WorkReport.find().populate('user', 'fullName').populate('project', 'name').sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
