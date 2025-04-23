const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const {
    updateUserProfile,
    updateFarmerProfile,
    updateAdminProfile,
    getUserProfile,
    getFarmerProfile,
    getAdminProfile
  } = require('../controllers/roleController');
// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Logout route (public)
router.post('/logout', logoutUser);

// For user
router.get('/user/profile', protect, roleProtect('user', 'admin'), getUserProfile);
router.post('/user/profile', protect, roleProtect('user', 'admin'), updateUserProfile);

// For farmer
router.get('/farmer/profile', protect, roleProtect('farmer', 'admin'), getFarmerProfile);
router.post('/farmer/profile', protect, roleProtect('farmer', 'admin'), updateFarmerProfile);

// For admin
router.get('/admin/profile', protect, roleProtect('admin'), getAdminProfile);
router.post('/admin/profile', protect, roleProtect('admin'), updateAdminProfile);


module.exports = router;


