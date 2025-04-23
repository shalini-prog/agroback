// controllers/reviewController.js

const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Check if user purchased this product
    const hasOrdered = await Order.findOne({
      product: productId,
      customer: userId,
      status: { $ne: 'cancelled' } // only non-cancelled orders count
    });

    if (!hasOrdered) {
      return res.status(403).json({ message: "You can only review products you have purchased." });
    }

    const product = await Product.findById(productId);

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.customer.toString() === userId
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    // Add new review
    const review = {
      customer: userId,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);

    // Update average rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });

  } catch (error) {
    console.error("❌ Add Review Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.user.userId; // Assuming protect middleware sets this
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      const existingReview = product.reviews.find(
        (rev) => rev.customer.toString() === userId
      );
  
      if (!existingReview) {
        return res.status(404).json({ message: 'Review not found for this user' });
      }
  
      // Remove review
      product.reviews = product.reviews.filter(
        (rev) => rev.customer.toString() !== userId
      );
  
      // Recalculate rating and numReviews
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        (product.reviews.length || 1);
  
      await product.save();
  
      res.status(200).json({ message: 'Review deleted successfully' });
  
    } catch (error) {
      console.error('❌ Delete Review Error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getFarmerReviews = async (req, res) => {
    try {
      const farmerId = req.user.userId;
      const products = await Product.find({ farmer: farmerId }).populate('reviews.customer', 'name email');
  
      const allReviews = products.map(product => ({
        productId: product._id,
        productTitle: product.title,
        reviews: product.reviews
      }));
  
      res.status(200).json({ reviews: allReviews });
    } catch (err) {
      console.error('❌ Error fetching farmer reviews:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getAllReviewsByAdmin = async (req, res) => {
    try {
      const products = await Product.find().populate('reviews.customer', 'name email');
  
      const allReviews = products.map(product => ({
        productId: product._id,
        productTitle: product.title,
        reviews: product.reviews
      }));
  
      res.status(200).json({ reviews: allReviews });
    } catch (err) {
      console.error('❌ Error fetching all reviews:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 3. Admin: Delete a review
  exports.deleteReviewByAdmin = async (req, res) => {
    try {
      const { productId, reviewId } = req.params;
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
      if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });
  
      // Remove the review
      product.reviews.splice(reviewIndex, 1);
  
      // Recalculate rating and numReviews
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / (product.numReviews || 1);
  
      await product.save();
  
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
      console.error('❌ Error deleting review:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };