const mongoose = require('mongoose');

const MONGOOSE_URI = "mongodb://root:password@localhost:27017/giiku?authSource=admin";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGOOSE_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;