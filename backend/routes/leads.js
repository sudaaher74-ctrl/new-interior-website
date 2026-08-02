const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { authAdmin } = require('../middleware/auth');

// This endpoint is public, so cap how fast one address can file enquiries.
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { msg: 'Too many enquiries from this address. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create a new lead (public endpoint, from contact form)
router.post('/', leadLimiter, async (req, res) => {
  try {
    // `website` is a honeypot: the form renders it hidden, so a human never
    // fills it in and a bot that autofills every field does. Answer 200 so the
    // bot has no signal that it was rejected.
    if (req.body.website) return res.json({ ok: true });

    const { name, phone, email, projectType, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ msg: 'Name and phone are required.' });
    }

    // Whitelist the fields rather than passing req.body straight to the model,
    // which would let a caller set status, source and notes themselves.
    const lead = new Lead({
      name: String(name).slice(0, 120),
      phone: String(phone).slice(0, 40),
      email: email ? String(email).slice(0, 160) : undefined,
      projectType: projectType ? String(projectType).slice(0, 80) : undefined,
      message: message ? String(message).slice(0, 4000) : undefined,
    });
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
