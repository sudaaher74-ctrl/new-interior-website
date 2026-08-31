const express = require('express');
const router = express.Router();
const SiteVisit = require('../models/SiteVisit');
const cloudinary = require('cloudinary').v2;
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware to verify token

// Log a new Site Visit
router.post('/log', auth, async (req, res) => {
  const { projectId, lat, lng, accuracy, photoUrl, photoBase64, expenseAmount, expenseDescription } = req.body;

  try {
    let finalPhotoUrl = photoUrl;

    // Upload to Cloudinary if base64 is provided
    if (photoBase64 && process.env.CLOUDINARY_CLOUD_NAME) {
      const uploadRes = await cloudinary.uploader.upload(photoBase64, { folder: 'os_interior_visits' });
      finalPhotoUrl = uploadRes.secure_url;
    } else if (photoBase64) {
      finalPhotoUrl = photoBase64;
    }

    const visit = new SiteVisit({
      user: req.user.id,
      project: projectId,
      location: { lat, lng, accuracy },
      photoUrl: finalPhotoUrl,
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

// Get all site visits for the logged-in employee (historical)
router.get('/my-visits', auth, async (req, res) => {
  try {
    const visits = await SiteVisit.find({
      user: req.user.id
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


// Admin endpoint to update expense status
router.put('/expense/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ msg: 'Site visit / expense not found' });
    }

    visit.expenseStatus = status;
    visit.expenseAdminComment = comment || '';
    
    await visit.save();

    // Populate user and project for the response
    await visit.populate('user', 'fullName');
    await visit.populate('project', 'title name');

    res.json({ msg: 'Expense updated successfully', visit });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

