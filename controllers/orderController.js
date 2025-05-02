const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');


exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    // Find orders where the farmer field matches
    const orders = await Order.find({ farmer: farmerId })
      .populate('product', 'title price')
      .populate('customer', 'name email');

    res.status(200).json({ orders });
  } catch (err) {
    console.error("❌ Error fetching farmer orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2. Check stock availability
    if (product.quantity === 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: `Only ${product.quantity} item(s) left in stock` });
    }

    // 3. Deduct stock
    product.quantity -= quantity;
    await product.save();

    // 4. Calculate price
    const totalPrice = product.price * quantity;

    // 5. Create order
    const order = await Order.create({
      product: product._id,
      customer: req.user.userId,
      farmer: product.farmer,
      quantity,
      totalPrice
    });

    // 6. Add notification to the farmer
    const notification = {
      message: `📦 New order placed for your product: ${product.title}`,
      product: product._id,
      order: order._id,
      createdAt: new Date()
    };

    await User.findByIdAndUpdate(product.farmer, {
      $push: { notifications: notification }
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('❌ Error placing order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getFarmerNotifications = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    const farmer = await User.findById(farmerId).select('notifications');

    res.status(200).json({ notifications: farmer.notifications });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const orders = await Order.find({ customer: customerId })
      .populate('product', 'title price')
      .populate('farmer', 'name');

    res.status(200).json({ orders });
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.cancelOrderByCustomer = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== customerId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'cancelled' || order.status === 'completed') {
      return res.status(400).json({ message: `Order already ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully by customer', order });
  } catch (err) {
    console.error('❌ Cancel Order by Customer Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrderByFarmer = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'cancelled' || order.status === 'completed') {
      return res.status(400).json({ message: `Order already ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully by farmer', order });
  } catch (err) {
    console.error('❌ Cancel Order by Farmer Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the farmer who owns the order can accept it
    if (order.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this order' });
    }

    if (order.status === 'accepted') {
      return res.status(400).json({ message: 'Order already accepted' });
    }

    // Accept the order
    order.status = 'accepted';
    await order.save();

    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (err) {
    console.error('❌ Error accepting order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the farmer who owns the order can complete it
    if (order.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to complete this order' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Order already completed' });
    }

    // Complete the order
    order.status = 'completed';
    await order.save();

    res.status(200).json({ message: 'Order completed successfully', order });
  } catch (err) {
    console.error('❌ Error completing order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.viewProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Map over products and dynamically add the imageUrl field
    const fullProducts = products.map((product) => ({
      ...product._doc,
      imageUrl: product.image
        ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`
        : null,
    }));

    // Return all products as a response
    res.json({ products: fullProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};


