const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const cloudinary = require('cloudinary').v2;
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function formatSiteVisit(row) {
  if (!row) return null;
  const projectObj = row.projects ? {
    id: row.projects.id,
    _id: row.projects.id,
    name: row.projects.title || row.projects.name,
    title: row.projects.title || row.projects.name,
    location: row.projects.location,
  } : null;

  const lat = typeof row.lat === 'number' ? row.lat : (parseFloat(row.lat) || 0);
  const lng = typeof row.lng === 'number' ? row.lng : (parseFloat(row.lng) || 0);
  const accuracy = typeof row.accuracy === 'number' ? row.accuracy : (parseFloat(row.accuracy) || 0);

  return {
    _id: row.id,
    id: row.id,
    user: row.user_id,
    project: projectObj || (row.project_id ? { id: row.project_id, _id: row.project_id, name: 'Assigned Project' } : { name: 'General Site Visit' }),
    location: {
      lat,
      lng,
      accuracy,
    },
    lat,
    lng,
    accuracy,
    photoUrl: row.photo_url,
    expenseAmount: Number(row.expense_amount) || 0,
    expenseDescription: row.expense_description || '',
    expenseStatus: row.expense_status || 'Approved',
    time: row.created_at,
    createdAt: row.created_at,
  };
}

// Log a new Site Visit
router.post('/log', auth, async (req, res) => {
  const { projectId, lat, lng, accuracy, photoUrl, photoBase64, expenseAmount, expenseDescription } = req.body;

  try {
    let finalPhotoUrl = photoUrl;

    if (photoBase64 && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const uploadRes = await cloudinary.uploader.upload(photoBase64, { folder: 'os_interior_visits' });
        finalPhotoUrl = uploadRes.secure_url;
      } catch (cloudErr) {
        console.warn('Cloudinary upload error, storing data URI directly:', cloudErr.message);
        finalPhotoUrl = photoBase64;
      }
    } else if (photoBase64) {
      finalPhotoUrl = photoBase64;
    }

    const { data: visit, error } = await supabase
      .from('site_visits')
      .insert({
        user_id: req.user.id,
        project_id: projectId || null,
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
        accuracy: Number(accuracy) || 0,
        photo_url: finalPhotoUrl,
        expense_amount: expenseAmount ? Number(expenseAmount) : 0,
        expense_description: expenseDescription || null,
        expense_status: expenseAmount ? 'Pending' : 'Approved',
      })
      .select('*, projects(id, title, location)')
      .single();

    if (error) throw error;
    res.json(formatSiteVisit(visit));
  } catch (err) {
    console.error('Site visit log error:', err);
    res.status(500).json({ msg: err.message || 'Server error logging site visit' });
  }
});

// Get User's Site Visits for Today
router.get('/my-today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('*, projects(id, title, location)')
      .eq('user_id', req.user.id)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((visits || []).map(formatSiteVisit));
  } catch (err) {
    console.error('My today visits error:', err);
    res.status(500).send('Server error');
  }
});

// Get User's All Site Visits
router.get('/my-visits', auth, async (req, res) => {
  try {
    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('*, projects(id, title, location)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((visits || []).map(formatSiteVisit));
  } catch (err) {
    console.error('My visits error:', err);
    res.status(500).send('Server error');
  }
});

// Admin endpoint to update expense status
router.put('/expense/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const { data: visit, error } = await supabase
      .from('site_visits')
      .update({ expense_status: status })
      .eq('id', req.params.id)
      .select('*, projects(id, title, location)')
      .single();

    if (error) throw error;
    res.json({ msg: `Expense marked as ${status}`, visit: formatSiteVisit(visit) });
  } catch (err) {
    console.error('Expense update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
