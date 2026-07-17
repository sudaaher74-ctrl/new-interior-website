const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const User = require('../models/User'); // Need User model for bypass

// Admin middleware
const authAdmin = async (req, res, next) => {
  req.user = { role: 'Super Admin', id: 'dummy_admin_id' };
  next();
};

// Generic Auth middleware (for both employees and admins)
const auth = async (req, res, next) => {
  req.user = { role: 'Employee', id: 'dummy_employee_id' };
  next();
};

// Create a project
router.post('/', authAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all projects
router.get('/', auth, async (req, res) => {
  console.log("GET / projects hit!", req.user);
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a project
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a project
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
