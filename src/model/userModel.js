import mongoose from 'mongoose';

const { Schema } = mongoose;

const userModel = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 for inactive, 1 for active
    default: 1, // Default status is active
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

export default mongoose.model('User', userModel);
