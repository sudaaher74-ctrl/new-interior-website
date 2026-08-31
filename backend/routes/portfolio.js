const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const cloudinary = require('cloudinary').v2;
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadBase64 = async (base64Str) => {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  const uploadRes = await cloudinary.uploader.upload(base64Str, { folder: 'os_interior_portfolio' });
  return uploadRes.secure_url;
};

// Get all portfolio projects (Public)
router.get('/', async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(projects || []);
  } catch (err) {
    console.error('Portfolio error:', err);
    res.status(500).send('Server error');
  }
});

// Create a new portfolio project (Admin only)
router.post('/', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    let { title, category, img, gallery, description, client, location, year } = req.body;
    
    if (img && img.startsWith('data:image')) {
      img = await uploadBase64(img);
    }
    
    if (gallery && gallery.length > 0) {
      gallery = await Promise.all(gallery.map(i => uploadBase64(i)));
    }

    const { data: project, error } = await supabase
      .from('portfolio_projects')
      .insert({
        title,
        category,
        cover_image: img,
        gallery_images: gallery || [],
        description,
        client,
        location,
        year,
      })
      .select()
      .single();

    if (error) throw error;
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a portfolio project
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ msg: 'Project removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
