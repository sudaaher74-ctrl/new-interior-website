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
  if (!process.env.CLOUDINARY_CLOUD_NAME) return base64Str;
  try {
    const uploadRes = await cloudinary.uploader.upload(base64Str, { folder: 'os_interior_blog' });
    return uploadRes.secure_url;
  } catch (err) {
    console.warn('Cloudinary blog upload warning, storing image directly:', err.message);
    return base64Str;
  }
};

// Get all published blog posts (Public)
router.get('/', async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(posts || []);
  } catch (err) {
    console.error('Blog get error:', err);
    res.status(500).send('Server error');
  }
});

// Create a new blog post (Admin only)
router.post('/', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    let { title, content, excerpt, coverImage, author, tags, isPublished } = req.body;
    
    if (coverImage && coverImage.startsWith('data:image')) {
      coverImage = await uploadBase64(coverImage);
    }

    const slug = (title || 'post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        cover_image: coverImage,
        author: author || 'OS Interiors Team',
        tags: tags || [],
        is_published: isPublished !== undefined ? isPublished : true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    res.json(post);
  } catch (err) {
    console.error('Blog create error:', err);
    res.status(500).send('Server error');
  }
});

// Delete a blog post
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
