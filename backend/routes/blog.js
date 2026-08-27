const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const BlogPost = require('../models/BlogPost');
const { auth, authorizeRoles, ADMIN_ROLES } = require('../middleware/auth');

// Helper function to upload base64 image to cloudinary
const uploadBase64 = async (base64Str) => {
  if (!base64Str.startsWith('data:image')) return base64Str; // Already a URL
  const uploadRes = await cloudinary.uploader.upload(base64Str, { folder: 'os_interior_blog' });
  return uploadRes.secure_url;
};

// Get all published blog posts (Public)
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all blog posts including drafts (Admin only)
router.get('/admin/all', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get a single blog post by slug (Public - but only if published)
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (!post.isPublished) return res.status(403).json({ msg: 'Post is not published yet' });
    res.json(post);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new blog post (Admin only)
router.post('/', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    let postData = { ...req.body };
    
    if (postData.coverImage && postData.coverImage.startsWith('data:image')) {
      postData.coverImage = await uploadBase64(postData.coverImage);
    }

    const post = new BlogPost(postData);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a blog post (Admin only)
router.put('/:id', auth, authorizeRoles(...ADMIN_ROLES, 'Project Manager'), async (req, res) => {
  try {
    let postData = { ...req.body };
    postData.updatedAt = Date.now();
    
    if (postData.coverImage && postData.coverImage.startsWith('data:image')) {
      postData.coverImage = await uploadBase64(postData.coverImage);
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, postData, { new: true });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a blog post (Admin only)
router.delete('/:id', auth, authorizeRoles(...ADMIN_ROLES), async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
