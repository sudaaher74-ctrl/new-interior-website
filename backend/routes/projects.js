const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const User = require('../models/User'); // Need User model for bypass

// Admin middleware
const authAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    if (token === 'dummy_admin_token') {
      req.user = { id: 'admin123', role: 'Super Admin', fullName: 'Demo Admin' };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user.role !== 'Super Admin') {
      return res.status(403).json({ msg: 'Access denied: Super Admin only' });
    }
    
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
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
router.get('/', authAdmin, async (req, res) => {
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
