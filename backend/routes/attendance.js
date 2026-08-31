const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

function formatAttendance(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    user: row.user_id,
    date: row.date,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    status: row.status,
    location: row.location,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// Get Today's Status
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('date', today)
      .maybeSingle();

    if (error) throw error;
    res.json(attendance ? formatAttendance(attendance) : { status: 'Not Checked In' });
  } catch (err) {
    console.error('Attendance today error:', err);
    res.status(500).send('Server error');
  }
});

// Get Attendance History (Employee)
router.get('/history', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data: records, error } = await query;
    if (error) throw error;
    res.json((records || []).map(formatAttendance));
  } catch (err) {
    console.error('Attendance history error:', err);
    res.status(500).send('Server error');
  }
});

// Admin/PM View All Attendance
router.get('/admin/all', [auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager')], async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    let query = supabase
      .from('attendance')
      .select('*, users(id, full_name, email, role)')
      .order('date', { ascending: false });

    if (userId) query = query.eq('user_id', userId);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data: records, error } = await query;
    if (error) throw error;
    res.json(records || []);
  } catch (err) {
    console.error('Admin attendance error:', err);
    res.status(500).send('Server error');
  }
});

// Check-In
router.post('/check-in', auth, async (req, res) => {
  const { lat, lng, accuracy, notes } = req.body;
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ msg: 'Already checked in today' });
    }

    const { data: created, error } = await supabase
      .from('attendance')
      .insert({
        user_id: req.user.id,
        date: today,
        check_in_time: now,
        status: 'Present',
        location: { lat, lng, accuracy },
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    res.json(formatAttendance(created));
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).send('Server error');
  }
});

// Check-Out
router.post('/check-out', auth, async (req, res) => {
  const { notes } = req.body;
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('date', today)
      .maybeSingle();

    if (!attendance || !attendance.check_in_time) {
      return res.status(400).json({ msg: 'You must check in first' });
    }

    if (attendance.check_out_time) {
      return res.status(400).json({ msg: 'Already checked out today' });
    }

    const { data: updated, error } = await supabase
      .from('attendance')
      .update({
        check_out_time: now,
        notes: notes ? (attendance.notes ? attendance.notes + ' | ' + notes : notes) : attendance.notes,
      })
      .eq('id', attendance.id)
      .select()
      .single();

    if (error) throw error;
    res.json(formatAttendance(updated));
  } catch (err) {
    console.error('Check-out error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
