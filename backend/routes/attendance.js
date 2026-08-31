const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

function formatAttendance(row) {
  if (!row) return null;
  const userObj = row.users ? {
    _id: row.users.id,
    id: row.users.id,
    fullName: row.users.full_name,
    name: row.users.full_name,
    email: row.users.email,
  } : null;

  let totalWorkingHours = 0;
  if (row.check_in_time) {
    const start = new Date(row.check_in_time).getTime();
    const end = row.check_out_time ? new Date(row.check_out_time).getTime() : Date.now();
    totalWorkingHours = Math.max(0, (end - start) / (1000 * 60 * 60));
  }

  return {
    _id: row.id,
    id: row.id,
    user: userObj || { _id: row.user_id, fullName: 'Employee' },
    userId: row.user_id,
    date: row.date,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    status: row.status || 'Present',
    location: row.location,
    notes: row.notes,
    totalWorkingHours,
    createdAt: row.created_at,
  };
}

// Get Today's Status
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*, users(id, full_name, email, role)')
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
      .select('*, users(id, full_name, email, role)')
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

    // --- 1. Fetch from attendance table ---
    let attQuery = supabase
      .from('attendance')
      .select('*, users(id, full_name, email, role)')
      .order('date', { ascending: false });

    if (userId) attQuery = attQuery.eq('user_id', userId);
    if (startDate) attQuery = attQuery.gte('date', startDate);
    if (endDate) attQuery = attQuery.lte('date', endDate);

    const { data: attRecords } = await attQuery;
    const formattedAtt = (attRecords || []).map(formatAttendance);

    // --- 2. Fetch from site_visits table as fallback/supplement ---
    let visitsQuery = supabase
      .from('site_visits')
      .select('*, users(id, full_name, email), projects(id, title, location)')
      .order('created_at', { ascending: false });

    if (userId) visitsQuery = visitsQuery.eq('user_id', userId);
    if (startDate) visitsQuery = visitsQuery.gte('created_at', startDate + 'T00:00:00');
    if (endDate) visitsQuery = visitsQuery.lte('created_at', endDate + 'T23:59:59');

    const { data: visitRecords } = await visitsQuery;

    // --- 3. Build a set of (user_id + date) already covered by attendance records ---
    const coveredKeys = new Set(formattedAtt.map(a => `${a.userId}_${a.date}`));

    // --- 4. Synthesize attendance from site_visits for days not already in attendance table ---
    const synthByKey = {};
    for (const v of (visitRecords || [])) {
      const date = (v.created_at || '').split('T')[0];
      const key = `${v.user_id}_${date}`;
      if (!coveredKeys.has(key) && !synthByKey[key]) {
        synthByKey[key] = {
          _id: `sv_${v.id}`,
          id: `sv_${v.id}`,
          user: v.users ? {
            _id: v.users.id,
            id: v.users.id,
            fullName: v.users.full_name,
            name: v.users.full_name,
            email: v.users.email,
          } : { _id: v.user_id, fullName: 'Employee' },
          userId: v.user_id,
          date,
          checkInTime: v.created_at,
          checkOutTime: null,
          status: 'Present',
          location: { lat: v.lat, lng: v.lng, accuracy: v.accuracy },
          notes: v.projects ? `On-site: ${v.projects.title || 'Project'}` : 'Verified via Site Visit Photo',
          project: v.projects ? {
            id: v.projects.id,
            name: v.projects.title || 'Project',
          } : null,
          totalWorkingHours: 0,
          createdAt: v.created_at,
        };
      }
    }

    // --- 5. Merge: real attendance records first, then synthesized ones ---
    const merged = [...formattedAtt, ...Object.values(synthByKey)];
    merged.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(merged);
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
