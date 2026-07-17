const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const Lead = require('../models/Lead');
const User = require('../models/User');

// Admin middleware
const authAdmin = async (req, res, next) => {
  req.user = { role: 'Super Admin', id: 'dummy_admin_id' };
  next();
};

// Create a new lead (public endpoint, from contact form)
router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all leads (admin only)
router.get('/', authAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update lead status (admin only)
router.put('/:id/status', authAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    
    lead.status = req.body.status || lead.status;
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a lead (admin only)
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Lead removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
