import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function generateToken(user, time) {
  if (!user) {
    throw new Error('User data is required to generate token');
  }

  return jwt.sign(
    {
      user_id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}
