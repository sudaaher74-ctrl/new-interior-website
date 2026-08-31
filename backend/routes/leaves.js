const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');
const { sendNotification, notifyAdmins } = require('./notifications');

// Format leave row
function formatLeave(row) {
  if (!row) return null;
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
      designation: row.users.designation
    } : null,
    leaveDate: row.leave_date,
    reason: row.reason || '',
    status: row.status || 'Pending',
    adminComment: row.admin_comment || '',
    createdAt: row.created_at
  };
}

// POST /api/v2/leaves — Employee submits leave request
router.post('/', auth, async (req, res) => {
  try {
    const { leaveDate, reason } = req.body;
    if (!leaveDate) {
      return res.status(400).json({ msg: 'Leave date is required' });
    }

    const { data: created, error } = await supabase
      .from('leaves')
      .insert({
        user_id: req.user.id,
        leave_date: leaveDate,
        reason: reason || '',
        status: 'Pending'
      })
      .select('*, users(id, full_name, email, role, designation)')
      .single();

    if (error) throw error;

    // Notify admins
    const empName = req.user.fullName || req.user.name || 'Employee';
    await notifyAdmins({
      senderName: empName,
      type: 'leave_request',
      message: `${empName} requested leave for ${new Date(leaveDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}: "${reason || 'No reason provided'}"`,
      link: '/admin'
    });

    res.status(201).json(formatLeave(created));
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ msg: 'Failed to submit leave request' });
  }
});

// GET /api/v2/leaves/my — Employee views their own leave history
router.get('/my', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaves')
      .select('*, users(id, full_name, email, role, designation)')
      .eq('user_id', req.user.id)
      .order('leave_date', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(formatLeave));
  } catch (err) {
    console.error('Fetch my leaves error:', err);
    res.status(500).json({ msg: 'Failed to fetch leaves' });
  }
});

// GET /api/v2/leaves/admin/all — Admin views all leave requests
router.get('/admin/all', [auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager')], async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('leaves')
      .select('*, users(id, full_name, email, role, designation)')
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map(formatLeave));
  } catch (err) {
    console.error('Admin fetch leaves error:', err);
    res.status(500).json({ msg: 'Failed to fetch leave requests' });
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
      .select('*, users(id, full_name, email, role, designation)')
      .single();

    if (error) throw error;

    // Send notification to employee
    if (updated && updated.user_id) {
      const formattedDate = new Date(updated.leave_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const statusIcon = status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : 'ℹ️';
      await sendNotification({
        recipientId: updated.user_id,
        senderName: req.user.fullName || 'Admin',
        type: `leave_${status.toLowerCase()}`,
        message: `Your leave request for ${formattedDate} has been ${status} ${statusIcon}.${adminComment ? ` Note: "${adminComment}"` : ''}`,
        link: '/employee'
      });
    }

    res.json(formatLeave(updated));
  } catch (err) {
    console.error('Update leave error:', err);
    res.status(500).json({ msg: 'Failed to update leave request' });
  }
});

module.exports = router;
