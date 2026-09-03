const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const cloudinary = require('cloudinary').v2;
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');
const { sendNotification, notifyAdmins } = require('./notifications');

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

  const userObj = row.users ? {
    _id: row.users.id,
    id: row.users.id,
    fullName: row.users.full_name,
    name: row.users.full_name,
    email: row.users.email,
  } : null;

  const lat = typeof row.lat === 'number' ? row.lat : (parseFloat(row.lat) || 0);
  const lng = typeof row.lng === 'number' ? row.lng : (parseFloat(row.lng) || 0);
  const accuracy = typeof row.accuracy === 'number' ? row.accuracy : (parseFloat(row.accuracy) || 0);

  return {
    _id: row.id,
    id: row.id,
    user: userObj || row.user_id,
    userId: row.user_id,
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
    expenseStatus: row.expense_status || (Number(row.expense_amount) > 0 ? 'Pending' : 'Approved'),
    expenseAdminComment: row.expense_admin_comment || '',
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
      .select('*, projects(id, title, location), users(id, full_name, email)')
      .single();

    if (error) throw error;

    // Auto-sync attendance: first photo = check-in, every subsequent photo updates check-out
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      const { data: existingAtt } = await supabase
        .from('attendance')
        .select('id, check_in_time')
        .eq('user_id', req.user.id)
        .eq('date', today)
        .maybeSingle();

      if (!existingAtt) {
        // First photo of the day → Check-In
        await supabase.from('attendance').insert({
          user_id: req.user.id,
          date: today,
          check_in_time: now,
          status: 'Present',
          location: { lat: Number(lat) || 0, lng: Number(lng) || 0, accuracy: Number(accuracy) || 0 },
          notes: 'Auto check-in via site photo report'
        });
      } else {
        // Subsequent photos → always update check-out to latest timestamp
        await supabase.from('attendance')
          .update({
            check_out_time: now,
            notes: 'Auto check-out updated via site photo report'
          })
          .eq('id', existingAtt.id);
      }
    } catch (attErr) {
      console.warn('Attendance auto-sync warning:', attErr.message);
    }

    // Notify admins about new site visit
    try {
      const empName = req.user.fullName || req.user.name || 'Employee';
      const projTitle = visit?.projects?.title || visit?.projects?.name || '';
      notifyAdmins({
        senderName: empName,
        type: 'site_visit',
        message: `${empName} logged site visit${projTitle ? ` at ${projTitle}` : ''}${expenseAmount ? ` (Expense: ₹${expenseAmount})` : ''}`,
        link: '/admin'
      });
    } catch (notifErr) {
      console.warn('Admin notification error on site visit:', notifErr.message);
    }

    res.json(formatSiteVisit(visit));
  } catch (err) {
    console.error('Site visit log error:', err);
    res.status(500).json({ msg: err.message || 'Server error logging site visit' });
  }
});

// Admin/PM: Get All Site Visits (Live Tracking & Photos & Expenses)
router.get('/all', [auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager')], async (req, res) => {
  try {
    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('*, projects(id, title, location), users(id, full_name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((visits || []).map(formatSiteVisit));
  } catch (err) {
    console.error('All visits error:', err);
    res.status(500).send('Server error');
  }
});

// Get User's Site Visits for Today
router.get('/my-today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('*, projects(id, title, location), users(id, full_name, email)')
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
      .select('*, projects(id, title, location), users(id, full_name, email)')
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
    const { status, comment } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const { data: visit, error } = await supabase
      .from('site_visits')
      .update({
        expense_status: status
      })
      .eq('id', req.params.id)
      .select('*, projects(id, title, location), users(id, full_name, email)')
      .single();

    if (error) throw error;

    // Send notification to employee
    if (visit && visit.user_id) {
      const statusIcon = status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : 'ℹ️';
      await sendNotification({
        recipientId: visit.user_id,
        senderName: req.user.fullName || 'Admin',
        type: `expense_${status.toLowerCase()}`,
        message: `Your travel expense of ₹${visit.expense_amount || 0} has been marked as ${status} ${statusIcon}.${comment ? ` Note: "${comment}"` : ''}`,
        link: '/employee'
      });
    }

    res.json({ msg: `Expense marked as ${status}`, visit: formatSiteVisit(visit) });
  } catch (err) {
    console.error('Expense update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
