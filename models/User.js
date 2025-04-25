const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'farmer', 'admin'],
    required: true,
  },

  // Common/User fields
  name: {
    type: String
  },
  phone: {
    type: String
  },
  dob: {
    type: String // Keep as string if you're passing "DD-MM-YYYY" format
  },

  // Farmer-specific fields
  zone: {
    type: String
  },
  area: {
    type: String
  },

  // Admin-specific fields
  empType: {
    type: String
  },
  empId: {
    type: String
  },
  dept: {
    type: String
  },
  address: {
    type: String
  },

  notifications: [notificationSchema],

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ]

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
