const express = require('express');
const router = express.Router();
const Pet = require('../Models/Pet');
const Shelter = require('../Models/Shelter');
const AdoptionRequest = require('../Models/AdoptionRequest');
const User = require('../Models/User');
const { protect, admin } = require('../Middleware/authMiddleware');

// Get admin dashboard statistics
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const [totalPets, totalShelters, totalRequests, pendingRequests, totalUsers, adminUsers] = await Promise.all([
      Pet.countDocuments(),
      Shelter.countDocuments(),
      AdoptionRequest.countDocuments(),
      AdoptionRequest.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
    ]);

    const recentRequests = await AdoptionRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('dogId', 'name breed')
      .populate('shelterId', 'name');

    res.json({
      statistics: {
        totalPets,
        totalShelters,
        totalRequests,
        pendingRequests,
        totalUsers,
        adminUsers,
      },
      recentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;