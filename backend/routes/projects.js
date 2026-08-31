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
    name: row.title,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    location: row.location,
    siteAddress: row.location,
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
    const {
      title,
      name,
      clientName,
      client_name,
      clientPhone,
      client_phone,
      location,
      siteAddress,
      status,
      budget,
      startDate,
      start_date,
      endDate,
      end_date,
      team,
      updates
    } = req.body;

    const projectTitle = title || name || 'Untitled Project';
    const projectLocation = location || siteAddress || '';
    const projectClientName = clientName || client_name || '';
    const projectClientPhone = clientPhone || client_phone || null;
    const projectBudget = typeof budget === 'number' ? budget : (parseFloat(budget) || 0);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: projectTitle,
        client_name: projectClientName,
        client_phone: projectClientPhone,
        location: projectLocation,
        status: status || 'Planning',
        budget: projectBudget,
        start_date: startDate || start_date || null,
        end_date: endDate || end_date || null,
        team: team || [],
        updates: updates || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase project create error details:', error);
      throw error;
    }
    res.json(formatProject(data));
  } catch (err) {
    console.error('Project create error:', err);
    res.status(500).json({ msg: err.message || 'Server error creating project' });
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
    if (body.title !== undefined || body.name !== undefined) updates.title = body.title || body.name;
    if (body.clientName !== undefined || body.client_name !== undefined) updates.client_name = body.clientName || body.client_name;
    if (body.clientPhone !== undefined || body.client_phone !== undefined) updates.client_phone = body.clientPhone || body.client_phone;
    if (body.location !== undefined || body.siteAddress !== undefined) updates.location = body.location || body.siteAddress;
    if (body.status !== undefined) updates.status = body.status;
    if (body.budget !== undefined) updates.budget = typeof body.budget === 'number' ? body.budget : (parseFloat(body.budget) || 0);
    if (body.startDate !== undefined || body.start_date !== undefined) updates.start_date = body.startDate || body.start_date || null;
    if (body.endDate !== undefined || body.end_date !== undefined) updates.end_date = body.endDate || body.end_date || null;
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
    res.status(500).json({ msg: err.message || 'Server error updating project' });
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
