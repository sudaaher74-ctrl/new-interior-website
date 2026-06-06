const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const User = require('../models/User');

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
