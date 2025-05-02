const User = require("../models/User")

exports.addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      const existingItem = user.cart.find(item => item.product.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
  
      await user.save();
      res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
      console.error('Add to Cart Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

exports.removeFromCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;
  
    try {
      const user = await User.findById(userId);
  
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
  
      await user.save();
      res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
      console.error('Remove from Cart Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getCart = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const user = await User.findById(userId).populate('cart.product');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
      const fullCart = user.cart
        .filter(item => item.product) // In case product is deleted
        .map(item => ({
          ...item.toObject(),
          product: {
            ...item.product._doc,
            imageUrl: item.product.image
              ? `${baseUrl}/uploads/${item.product.image}`
              : null,
          },
        }));
  
      res.status(200).json({ cart: fullCart });
    } catch (error) {
      console.error('Get Cart Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  