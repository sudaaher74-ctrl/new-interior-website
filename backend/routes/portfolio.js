const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const PortfolioProject = require('../models/PortfolioProject');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

// Optional: Cloudinary config, though it might be done in siteVisits or server.js globally
// Better to configure it here just in case if not done globally
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Get all portfolio projects (Public)
router.get('/', async (req, res) => {
  try {
    const projects = await PortfolioProject.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get a single portfolio project by slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await PortfolioProject.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Helper function to upload base64 image to cloudinary
const uploadBase64 = async (base64Str) => {
  if (!base64Str.startsWith('data:image')) return base64Str; // Already a URL
  const uploadRes = await cloudinary.uploader.upload(base64Str, { folder: 'os_interior_portfolio' });
  return uploadRes.secure_url;
};

// Create a new portfolio project (Admin only)
router.post('/', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    let projectData = { ...req.body };
    
    if (projectData.img && projectData.img.startsWith('data:image')) {
      projectData.img = await uploadBase64(projectData.img);
    }
    
    if (projectData.galleryWide && projectData.galleryWide.startsWith('data:image')) {
      projectData.galleryWide = await uploadBase64(projectData.galleryWide);
    }
    
    if (projectData.gallery && projectData.gallery.length > 0) {
      projectData.gallery = await Promise.all(
        projectData.gallery.map(img => uploadBase64(img))
      );
    }

    const project = new PortfolioProject(projectData);
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a portfolio project (Admin only)
router.put('/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    let projectData = { ...req.body };
    
    if (projectData.img && projectData.img.startsWith('data:image')) {
      projectData.img = await uploadBase64(projectData.img);
    }
    
    if (projectData.galleryWide && projectData.galleryWide.startsWith('data:image')) {
      projectData.galleryWide = await uploadBase64(projectData.galleryWide);
    }
    
    if (projectData.gallery && projectData.gallery.length > 0) {
      projectData.gallery = await Promise.all(
        projectData.gallery.map(img => uploadBase64(img))
      );
    }

    const project = await PortfolioProject.findByIdAndUpdate(req.params.id, projectData, { new: true });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a portfolio project
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    await PortfolioProject.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
