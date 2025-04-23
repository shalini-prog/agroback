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
      const user = await User.findById(userId).populate('cart.product', 'title price image');
  
      res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error('Get Cart Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  