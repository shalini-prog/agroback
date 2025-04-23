const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not found in .env");

    await mongoose.connect(uri); // No need for deprecated options
    console.log("✅ MongoDB connected using .env");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    process.exit(1); // Optional: exit process if DB fails to connect
  }
};

module.exports = connectDB;
