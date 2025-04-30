const User = require('../models/User');
const Product = require('../models/Product');

const path = require('path');

exports.addProduct = async (req, res) => {
  try {
    const farmer = await User.findById(req.user.userId);

    // Check if profile is complete
    if (!farmer.name || !farmer.zone || !farmer.area) {
      return res.status(400).json({ msg: 'Complete your profile before adding products' });
    }

    const { title, type, description, price, quantity } = req.body;

    const imageFilename = req.file ? req.file.filename : null;

    const product = new Product({
      farmer: req.user.userId,
      title,
      type,
      description,
      price,
      quantity,
      image: imageFilename,
    });

    await product.save();

    // Construct full image URL (e.g. http://localhost:5000/uploads/filename.jpg)
    const imageUrl = imageFilename
      ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${imageFilename}`
      : null;

    // Return the new product with imageUrl
    res.status(201).json({
      message: 'Product added successfully',
      product: {
        ...product._doc,
        imageUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding product' });
  }
};

  
 

  exports.updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      // 1. Find product
      const product = await Product.findById(productId);
  
      // 2. Handle not found
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // 3. Ensure farmer field exists
      if (!product.farmer || product.farmer.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this product' });
      }
  
      // 4. Update fields
      const { title, type, description, price, quantity } = req.body;
  
      if (title) product.title = title;
      if (type) product.type = type;
      if (description) product.description = description;
      if (price) product.price = price;
      if (quantity) product.quantity = quantity;
      if (req.file) product.image = req.file.filename;
  
      const updatedProduct = await product.save();
  
      res.json({ message: 'Product updated successfully', product: updatedProduct });
  
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  



exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Only the owner farmer can delete
      if (product.farmer.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this product' });
      }
  
      await product.deleteOne();
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getMyProducts = async (req, res) => {
    try {
      const products = await Product.find({ farmer: req.user.userId });
  
      const fullProducts = products.map((product) => ({
        ...product._doc,
        imageUrl: product.image
          ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${product.image}`
          : null,
      }));
  
      res.json({ products: fullProducts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error fetching products' });
    }
  };
  