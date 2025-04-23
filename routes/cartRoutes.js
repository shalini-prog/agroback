const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const {
  addToCart,
  removeFromCart,
  getCart
} = require('../controllers/cartController');

// Add to cart
router.post('/add', protect, roleProtect('user'), addToCart);

// Remove from cart
router.delete('/remove/:productId', protect, roleProtect('user'), removeFromCart);

// View cart
router.get('/', protect, roleProtect('user'), getCart);

module.exports = router;
