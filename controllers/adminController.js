const Order = require('../models/Order');
const User = require('../models/User')

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'title price')
      .populate('customer', 'name email')
      .populate('farmer', 'name email');

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully by admin' });
  } catch (error) {
    console.error('❌ Admin delete order error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
