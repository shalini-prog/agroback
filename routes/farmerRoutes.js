const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const User = require('../models/User');
const { getFarmerNotifications } = require('../controllers/orderController');

// ✅ Get all notifications for a farmer
router.get('/farmer/notifications', protect, roleProtect('farmer'), getFarmerNotifications);



module.exports = router;
