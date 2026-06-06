const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Employee Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    
    // Return token and basic user info
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role,
        profilePhoto: user.profilePhoto
      } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Setup Initial Super Admin
router.post('/setup-admin', async (req, res) => {
    const { employeeId, fullName, email, password, mobileNumber } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({ 
            employeeId, 
            fullName, 
            email, 
            password: hashedPassword, 
            mobileNumber,
            role: 'Super Admin'
        });

        await user.save();
        res.json({ msg: 'Super Admin created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
