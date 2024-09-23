import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connect = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connect);
    console.log('database connected');
  } catch (error) {
    console.error(`Error connecting to connectDB: ${error}`);
  }
};

export default connectDB;