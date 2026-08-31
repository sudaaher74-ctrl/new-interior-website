const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth } = require('../middleware/auth');

/**
 * Utility helper to create notification record in Supabase
 */
async function sendNotification({ recipientId, senderName, type, message, link = '' }) {
  try {
    if (!recipientId) return;
    await supabase.from('notifications').insert({
      recipient_id: recipientId,
      sender_name: senderName || 'System',
      type: type || 'info',
      message: message || '',
      link: link || '',
      is_read: false
    });
  } catch (err) {
    console.error('Error creating notification:', err);
  }
}

/**
 * Helper to notify all active Super Admin / Admin users
 */
async function notifyAdmins({ senderName, type, message, link = '/admin' }) {
  try {
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .in('role', ['Super Admin', 'Owner', 'Admin']);

    if (admins && admins.length > 0) {
      const rows = admins.map(a => ({
        recipient_id: a.id,
        sender_name: senderName || 'Employee',
        type: type || 'info',
        message: message || '',
        link: link || '/admin',
        is_read: false
      }));
      await supabase.from('notifications').insert(rows);
    }
  } catch (err) {
    console.error('Error notifying admins:', err);
  }
}

// GET /api/v2/notifications/my
router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ msg: 'Failed to fetch notifications' });
  }
});

// PUT /api/v2/notifications/read/:id
router.put('/read/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = req.params.id;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId)
      .eq('recipient_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ msg: 'Failed to mark notification as read' });
  }
});

// PUT /api/v2/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ msg: 'Failed to mark all as read' });
  }
});

module.exports = router;
module.exports.sendNotification = sendNotification;
module.exports.notifyAdmins = notifyAdmins;
