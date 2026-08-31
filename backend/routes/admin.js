const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

// Get Dashboard Stats
router.get('/stats', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Ongoing');

    const { count: totalEmployees } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'Employee');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: siteVisitsToday } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    res.json({
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      totalEmployees: totalEmployees || 0,
      siteVisitsToday: siteVisitsToday || 0,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).send('Server error');
  }
});

// Get Site Visits
router.get('/site-visits', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('*, users(id, full_name, profile_photo), projects(id, title, location)')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(visits || []);
  } catch (err) {
    console.error('Admin site visits error:', err);
    res.status(500).send('Server error');
  }
});

// Get All Employees
router.get('/employees', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { data: employees, error } = await supabase
      .from('users')
      .select('id, full_name, email, mobile_number, role, employee_id, is_active, created_at, profile_photo')
      .eq('role', 'Employee')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formatted = (employees || []).map(emp => ({
      _id: emp.id,
      id: emp.id,
      fullName: emp.full_name,
      email: emp.email,
      mobileNumber: emp.mobile_number,
      role: emp.role,
      employeeId: emp.employee_id,
      isActive: emp.is_active,
      createdAt: emp.created_at,
      profilePhoto: emp.profile_photo,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Admin employees get error:', err);
    res.status(500).send('Server error');
  }
});

// Create Employee
router.post('/employees', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  const { fullName, email, password, mobileNumber, designation } = req.body;
  try {
    const cleanEmail = String(email).toLowerCase().trim();
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const employeeId = 'EMP' + ((count || 0) + 1).toString().padStart(3, '0');

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        employee_id: employeeId,
        full_name: fullName,
        email: cleanEmail,
        password: hashedPassword,
        mobile_number: mobileNumber,
        role: 'Employee',
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ msg: 'Employee created successfully', user: { id: user.id, fullName: user.full_name } });
  } catch (err) {
    console.error('Admin create employee error:', err);
    res.status(500).send('Server error');
  }
});

// Update Employee
router.put('/employees/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  const { fullName, email, mobileNumber, designation, password } = req.body;
  try {
    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (email) updates.email = String(email).toLowerCase().trim();
    if (mobileNumber !== undefined) updates.mobile_number = mobileNumber;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const { data: employee, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ msg: 'Employee updated', employee });
  } catch (err) {
    console.error('Admin update employee error:', err);
    res.status(500).send('Server error');
  }
});

// Delete Employee
router.delete('/employees/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error('Admin delete employee error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
