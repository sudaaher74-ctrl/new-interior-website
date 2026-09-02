const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');
const { sendNotification, notifyAdmins } = require('./notifications');

// Format leave row with date range support
function formatLeave(row) {
  if (!row) return null;
  const startDate = row.leave_date || row.start_date;
  const endDate = row.end_date || startDate;
  
  let days = row.total_days;
  if (!days && startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }
  days = days || 1;

  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    user: row.users ? {
      id: row.users.id,
      _id: row.users.id,
      fullName: row.users.full_name,
      name: row.users.full_name,
      email: row.users.email,
      role: row.users.role,
      designation: row.users.designation || ''
    } : null,
    leaveDate: startDate,
    startDate: startDate,
    endDate: endDate,
    totalDays: days,
    reason: row.reason || '',
    status: row.status || 'Pending',
    adminComment: row.admin_comment || '',
    createdAt: row.created_at
  };
}

// POST /api/v2/leaves — Employee submits leave request (supports single date or date-to-date range)
router.post('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, leaveDate, reason } = req.body;
    const fromDate = startDate || leaveDate;
    const toDate = endDate || fromDate;

    if (!fromDate) {
      return res.status(400).json({ msg: 'Leave start date is required' });
    }

    const s = new Date(fromDate);
    const e = new Date(toDate);
    if (e < s) {
      return res.status(400).json({ msg: 'End date cannot be earlier than start date' });
    }

    const totalDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // Try inserting with end_date & total_days, with fallback if columns not yet added to Supabase
    let insertPayload = {
      user_id: req.user.id,
      leave_date: fromDate,
      end_date: toDate,
      total_days: totalDays,
      reason: reason || '',
      status: 'Pending'
    };

    let { data: created, error } = await supabase
      .from('leaves')
      .insert(insertPayload)
      .select('*, users(id, full_name, email, role)')
      .single();

    if (error && (error.code === '42703' || (error.message && error.message.includes('end_date')))) {
      // Fallback for when end_date column is not yet migrated
      const fallbackPayload = {
        user_id: req.user.id,
        leave_date: fromDate,
        reason: totalDays > 1 ? `${reason ? reason + ' ' : ''}[${fromDate} to ${toDate} (${totalDays} days)]` : (reason || ''),
        status: 'Pending'
      };
      const fallbackRes = await supabase
        .from('leaves')
        .insert(fallbackPayload)
        .select('*, users(id, full_name, email, role)')
        .single();

      if (fallbackRes.error) throw fallbackRes.error;
      created = { ...fallbackRes.data, end_date: toDate, total_days: totalDays };
    } else if (error) {
      throw error;
    }

    // Format readable date string for notification
    const dateText = (fromDate === toDate)
      ? `${new Date(fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} (1 day)`
      : `${new Date(fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} to ${new Date(toDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} (${totalDays} days)`;

    // Notify admins
    const empName = req.user.fullName || req.user.name || 'Employee';
    try {
      await notifyAdmins({
        senderName: empName,
        type: 'leave_request',
        message: `${empName} requested ${totalDays} day${totalDays > 1 ? 's' : ''} leave (${dateText}): "${reason || 'No reason provided'}"`,
        link: '/admin'
      });
    } catch (notifErr) {
      console.warn('Admin notification error:', notifErr.message);
    }

    res.status(201).json(formatLeave(created));
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ msg: err.message || 'Failed to submit leave request' });
  }
});

// GET /api/v2/leaves/my — Employee views their own leave history
router.get('/my', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaves')
      .select('*, users(id, full_name, email, role)')
      .eq('user_id', req.user.id)
      .order('leave_date', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(formatLeave));
  } catch (err) {
    console.error('Fetch my leaves error:', err);
    res.status(500).json({ msg: err.message || 'Failed to fetch leaves' });
  }
});

// GET /api/v2/leaves/admin/all — Admin views all leave requests
router.get('/admin/all', [auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager')], async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('leaves')
      .select('*, users(id, full_name, email, role)')
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map(formatLeave));
  } catch (err) {
    console.error('Admin fetch leaves error:', err);
    res.status(500).json({ msg: err.message || 'Failed to fetch leave requests' });
  }
});

// PUT /api/v2/leaves/admin/:id — Admin approves/rejects a leave
router.put('/admin/:id', [auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager')], async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const { data: updated, error } = await supabase
      .from('leaves')
      .update({
        status,
        admin_comment: adminComment || ''
      })
      .eq('id', req.params.id)
      .select('*, users(id, full_name, email, role)')
      .single();

    if (error) throw error;

    // Send notification to employee
    if (updated && updated.user_id) {
      try {
        const sDate = updated.leave_date;
        const eDate = updated.end_date || sDate;
        const totalDays = updated.total_days || 1;
        const dateText = (sDate === eDate)
          ? `${new Date(sDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} (1 day)`
          : `${new Date(sDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} to ${new Date(eDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} (${totalDays} days)`;

        const statusIcon = status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : 'ℹ️';
        await sendNotification({
          recipientId: updated.user_id,
          senderName: req.user.fullName || 'Admin',
          type: `leave_${status.toLowerCase()}`,
          message: `Your leave request for ${dateText} has been ${status} ${statusIcon}.${adminComment ? ` Note: "${adminComment}"` : ''}`,
          link: '/employee'
        });
      } catch (notifErr) {
        console.warn('Employee notification error:', notifErr.message);
      }
    }

    res.json(formatLeave(updated));
  } catch (err) {
    console.error('Update leave error:', err);
    res.status(500).json({ msg: err.message || 'Failed to update leave request' });
  }
});

module.exports = router;
