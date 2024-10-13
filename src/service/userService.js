import userModel from '../model/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

class UserService {
  async createUser(userData) {
    try {
        // Check if the email already exists
      const existingUser = await userModel.findOne({ email: userData.email });
      if (existingUser) {
        return { status: 'error', message: 'Email already in use' };
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create a new user with hashed password
      const newUser = new userModel({
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        password: hashedPassword, // Store hashed password
        status: userData.status || 1, // Default to active
      });
      
      // Save the user to the database
      await newUser.save();
      
      // Generate a token (exclude password from token)
      const token = generateToken({ 
        id: newUser._id, 
        email: newUser.email, 
        fname: newUser.fname, 
        lname: newUser.lname 
      });
      
      // Update the user record with the token in the database
      await userModel.findByIdAndUpdate(
        newUser._id,              // Find user by ID
        { token: token },         // Update token field
        { new: true } // Return updated user
      );
  
      // Return the token as a response
      return { staus: 'success', token, message:`User created successfully` };
      
    } catch (error) {
      // Handle error gracefully
      return { staus: 'error', message: error.message };
    }
  }
  

  async loginUser(email, password) {
    const user = await userModel.findOne({ email: email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = generateToken(user);
    return { success: true, token: token, message:`Successfully logged in` }; 
  }


  async sendResetLink(email) {
    try {
      const user = await userModel.findOne({ email: email });
  
      if (!user) {
        return { success: false, message: 'User not found' };
      }
  
      const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const resetUrl = `http://yourdomain.com/reset-password/${resetToken}`;
      const htmlContent = `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`;
  
      if (!user.email) {
        return { success: false, message: 'User email is missing' };
      }
  
      // Send the reset email and catch any error in sending
      await sendEmail(user.email, 'Password Reset', htmlContent);
      
      return { success: true };
  
    } catch (error) {
      // Return any email sending errors back to the controller
      return { success: false, message: `Failed to send reset link: ${error.message}` };
    }
  }

  async resetPassword(token, password) {
    try {
      // Verify the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token first
      const userId = decoded.user_id; 
      const user = await userModel.findById(userId); // Get user by decoded ID
    
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const updatedUser = await userModel.findByIdAndUpdate(
        userId, // Find the user by ID
        { password: hashedPassword }, // Update the password field
        { new: true } // Options: Return the updated user, validate, and select fields
      );

      if (!updatedUser) {
        return { success: false, message: 'User not found' };
      }
  
      // Return success message
      return { success: true, message: 'Password reset successfully'};

      
  
    } catch (error) {
      // Return error message if JWT verification fails or any other error occurs
      return { success: false, message: `Failed to verify token: ${error.message}` };
    }
  }

  async getUserById(id) {
    try {
      // Verify the token to get the user ID
      console.log(id);
      const user = await userModel.findById(id); // Get user by decoded ID
    
      if (!user) {
        return { success: false, message: 'User not found' };
      }
        
      return { success: true, data:user, message:'user data get successfully'};
  
    } catch (error) {
      // Return error message if JWT verification fails or any other error occurs
      return { success: false, message: `Failed to verify token: ${error.message}` };
    }
  }
  
}

export default new UserService();
