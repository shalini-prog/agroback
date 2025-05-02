// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const { addReview, getMyReviews } = require('../controllers/reviewController');
const roleProtect = require('../middleware/roleProtect');
const { deleteReview } = require('../controllers/reviewController');
const {
    getFarmerReviews,
    getAllReviewsByAdmin,
    deleteReviewByAdmin,
  } = require('../controllers/reviewController');

  router.get('/farmer', protect,roleProtect('farmer'), getFarmerReviews);

// Admin: view all reviews
router.get('/admin',protect,roleProtect('admin'), getAllReviewsByAdmin);

// Admin: delete specific review from a product
router.delete('/:productId/:reviewId', protect,roleProtect('admin'), deleteReviewByAdmin);
router.post('/:productId', protect,roleProtect('user'), addReview);
router.delete('/:reviewId/review', protect, deleteReview);
router.get('/my',protect,roleProtect('user'),getMyReviews)

module.exports = router;
