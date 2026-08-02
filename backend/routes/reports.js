const express = require('express');
const router = express.Router();
const WorkReport = require('../models/WorkReport');
const { auth } = require('../middleware/auth');

// Middleware to verify token

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
