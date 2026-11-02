const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

function formatLead(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    status: row.status,
    budget: row.budget,
    location: row.location,
    requirement: row.requirement,
    notes: row.notes,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
  };
}

// Public lead limiter
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { msg: 'Too many enquiries from this address. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const { notifyAdmins } = require('./notifications');

// Create a new lead (public endpoint, from contact form)
router.post('/', leadLimiter, async (req, res) => {
  try {
    if (req.body.website) return res.json({ ok: true, success: true });

    const { name, phone, email, projectType, message, requirement, location, budget, area } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ msg: 'Name and phone are required.' });
    }

    const cleanName = String(name).trim().slice(0, 120);
    const cleanPhone = String(phone).trim().slice(0, 40);
    const cleanEmail = email ? String(email).trim().slice(0, 160) : null;
    const reqText = (requirement || projectType) ? String(requirement || projectType).trim().slice(0, 200) : null;
    const locText = location ? String(location).trim().slice(0, 200) : null;

    // Parse numeric budget if valid, otherwise keep null for DB column
    let numericBudget = null;
    if (typeof budget === 'number' && !isNaN(budget)) {
      numericBudget = budget;
    } else if (typeof budget === 'string' && /^\d+$/.test(budget.trim())) {
      numericBudget = parseInt(budget.trim(), 10);
    }

    // Build structured notes capturing all message, area, and budget details
    const noteParts = [
      message ? String(message).trim() : null,
      area ? `Area: ${String(area).trim()}` : null,
      budget && numericBudget === null ? `Budget: ${String(budget).trim()}` : null,
    ].filter(Boolean);
    const notes = noteParts.length > 0 ? noteParts.join(' | ').slice(0, 4000) : null;

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        requirement: reqText,
        location: locText,
        budget: numericBudget,
        notes: notes,
        status: 'New',
      })
      .select()
      .single();

    if (error) throw error;

    // Notify admins in dashboard
    if (typeof notifyAdmins === 'function') {
      notifyAdmins({
        senderName: cleanName,
        type: 'lead',
        message: `New Lead: ${cleanName} (${cleanPhone}) — ${reqText || 'Commercial Inquiry'}`,
        link: '/employee-dashboard.html',
      }).catch((notifErr) => {
        console.error('Failed to send admin notification:', notifErr);
      });
    }

    res.json({ success: true, lead: formatLead(data) });
  } catch (err) {
    console.error('Lead create error:', err);
    res.status(500).json({ msg: 'Server error creating enquiry. Please contact directly via WhatsApp.' });
  }
});

// Get all leads (admin only)
router.get('/', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(formatLead));
  } catch (err) {
    console.error('Leads get error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update lead status (admin only)
router.put('/:id/status', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(formatLead(data));
  } catch (err) {
    console.error('Lead status update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update lead details (admin only)
router.put('/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const body = req.body;
    const updates = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.status !== undefined) updates.status = body.status;
    if (body.budget !== undefined) updates.budget = body.budget;
    if (body.location !== undefined) updates.location = body.location;
    if (body.requirement !== undefined) updates.requirement = body.requirement;
    if (body.assignedTo !== undefined) updates.assigned_to = body.assignedTo;

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(formatLead(data));
  } catch (err) {
    console.error('Lead update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a lead (admin only)
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ msg: 'Lead removed' });
  } catch (err) {
    console.error('Lead delete error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
