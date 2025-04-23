const User = require('../models/User');

// -------- USER PROFILE --------

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('phone name dob');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Get User Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { phone, name, dob } = req.body;

  if (!phone || !name || !dob) {
    return res.status(400).json({ msg: 'Phone, name, and DOB are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { phone, name, dob } },
      { new: true, select: 'phone name dob' }
    );
    res.json({ msg: 'User profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error("Update User Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------- FARMER PROFILE --------

// Get farmer profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findById(req.user.userId).select('name zone area');
    if (!farmer) {
      return res.status(404).json({ msg: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (err) {
    console.error("Get Farmer Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update farmer profile
exports.updateFarmerProfile = async (req, res) => {
  const { name, zone, area } = req.body;

  if (!name || !zone || !area) {
    return res.status(400).json({ msg: 'Name, zone, and area are required' });
  }

  try {
    const updatedFarmer = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { name, zone, area } },
      { new: true, select: 'name zone area' }
    );
    res.json({ msg: 'Farmer profile updated successfully', farmer: updatedFarmer });
  } catch (err) {
    console.error("Update Farmer Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------- ADMIN PROFILE --------

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId).select('empType empId dept phone address');
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error("Get Admin Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update admin profile
exports.updateAdminProfile = async (req, res) => {
  const { empType, empId, dept, phone, address } = req.body;

  if (!empType || !empId || !dept || !phone || !address) {
    return res.status(400).json({ msg: 'All fields are required for admin' });
  }

  try {
    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { empType, empId, dept, phone, address } },
      { new: true, select: 'empType empId dept phone address' }
    );
    res.json({ msg: 'Admin profile updated successfully', admin: updatedAdmin });
  } catch (err) {
    console.error("Update Admin Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};
