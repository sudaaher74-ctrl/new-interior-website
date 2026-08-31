const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

function formatProject(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    location: row.location,
    status: row.status,
    budget: row.budget,
    startDate: row.start_date,
    endDate: row.end_date,
    team: row.team || [],
    updates: row.updates || [],
    createdAt: row.created_at,
  };
}

// Create a project
router.post('/', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { title, clientName, clientPhone, location, status, budget, startDate, endDate, team, updates } = req.body;
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        client_name: clientName,
        client_phone: clientPhone,
        location,
        status: status || 'Planning',
        budget: budget || 0,
        start_date: startDate || null,
        end_date: endDate || null,
        team: team || [],
        updates: updates || [],
      })
      .select()
      .single();

    if (error) throw error;
    res.json(formatProject(data));
  } catch (err) {
    console.error('Project create error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(formatProject));
  } catch (err) {
    console.error('Projects get error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a project
router.put('/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const body = req.body;
    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.clientName !== undefined) updates.client_name = body.clientName;
    if (body.clientPhone !== undefined) updates.client_phone = body.clientPhone;
    if (body.location !== undefined) updates.location = body.location;
    if (body.status !== undefined) updates.status = body.status;
    if (body.budget !== undefined) updates.budget = body.budget;
    if (body.startDate !== undefined) updates.start_date = body.startDate;
    if (body.endDate !== undefined) updates.end_date = body.endDate;
    if (body.team !== undefined) updates.team = body.team;
    if (body.updates !== undefined) updates.updates = body.updates;

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(formatProject(data));
  } catch (err) {
    console.error('Project update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error('Project delete error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
