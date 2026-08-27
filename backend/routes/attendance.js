const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');

// Middleware to verify token

// Get Today's Status
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    }).populate('project', 'name');

    res.json(attendance || { status: 'Not Checked In' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get Attendance History (Employee)
router.get('/history', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const records = await Attendance.find(query)
      .populate('project', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin/PM View All Attendance
router.get('/admin/all', [auth, authorizeRoles('Admin', 'Project Manager')], async (req, res) => {
  try {
    const { projectId, userId, startDate, endDate } = req.query;
    let query = {};

    if (projectId) query.project = projectId;
    if (userId) query.user = userId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const records = await Attendance.find(query)
      .populate('user', 'name email role')
      .populate('project', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Haversine formula to calculate distance in meters
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Check-In
router.post('/check-in', auth, async (req, res) => {
  const { projectId, lat, lng, accuracy, selfieUrl, deviceInfo } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Validate Radius
    if (project.coordinates && project.coordinates.lat && project.coordinates.lng) {
      const distance = getDistanceInMeters(lat, lng, project.coordinates.lat, project.coordinates.lng);
      const allowedRadius = project.geofenceRadius || 100;
      if (distance > allowedRadius) {
        return res.status(400).json({ msg: `You are not at the assigned site. Distance: ${Math.round(distance)}m. Allowed: ${allowedRadius}m` });
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ user: req.user.id, date: { $gte: today } });
    if (attendance && attendance.checkIn && attendance.checkIn.time) {
       return res.status(400).json({ msg: 'Already checked in today' });
    }

    if (!attendance) {
        attendance = new Attendance({
            user: req.user.id,
            project: projectId,
            date: new Date()
        });
    }
    
    attendance.checkIn = {
      time: new Date(),
      location: { lat, lng, accuracy },
      selfieUrl,
      deviceInfo
    };
    
    // Auto-resolve Late Arrival
    const checkInTime = new Date();
    const cutOffTime = new Date();
    cutOffTime.setHours(10, 0, 0, 0); // 10:00 AM local time
    
    if (checkInTime > cutOffTime) {
      attendance.status = 'Late Arrival';
    } else {
      attendance.status = 'Present';
    }

    await attendance.save();
    res.json(attendance);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Check-Out
router.post('/check-out', auth, async (req, res) => {
  const { workSummary, progressPhotos } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ user: req.user.id, date: { $gte: today } });
    if (!attendance || !attendance.checkIn) {
       return res.status(400).json({ msg: 'You must check in first' });
    }

    if (attendance.checkOut && attendance.checkOut.time) {
        return res.status(400).json({ msg: 'Already checked out today' });
    }

    attendance.checkOut = {
      time: new Date(),
      workSummary,
      progressPhotos
    };

    // Calculate hours
    const msDiff = attendance.checkOut.time - attendance.checkIn.time;
    attendance.totalWorkingHours = (msDiff / (1000 * 60 * 60)).toFixed(2);

    await attendance.save();
    res.json(attendance);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
