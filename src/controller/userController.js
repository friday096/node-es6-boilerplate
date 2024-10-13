import userService from '../service/userService.js';

class UserController {
  async createUser(req, res, next) {
    try {
      const userData = req.body; // Get user data from request body
      const { token, message, status } = await userService.createUser(userData); // Call the service

      // Return the created user (without password) and the token
      res.status(201).json({
        message: message,
        status: status,
        token: token 
      });
      
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body; // Get email and password from request body
      const result = await userService.loginUser(email, password); // Call the service

      // If login is successful, send success response with token
      if (result.success) {
        res.status(200).json({
          message: result.message,
          status: 'success',
          token: result.token
        });
      } else {
        // If login fails, send a 401 response with error message
        res.status(401).json({
          message: result.message,
          status: 'error'
        });
      }
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
  async forgetPassword(req, res, next) {
    try {
      const email = req.body.email; // Get email from request body
      const result = await userService.sendResetLink(email); // Pass email to service
      if (result.success) {
        res.status(200).json({
          message: 'Reset link sent to your email',
          status: 'success',
          token: result.token
        });
      } else {
        // If login fails, send a 401 response with error message
        res.status(401).json({
          message: result.message,
          status: 'error'
        });
      }

      // res.status(200).json({ message: 'Reset link sent to your email' }); // Send success message
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, password} = req.body;
      const result = await userService.verifyToken(token, password); 

      if (result.success) {
        res.status(200).json({
          message: result.message,
          status: 'success',
          token: result.token
        });
      } else {
        res.status(401).json({
          message: result.message,
          status: 'error'
        });
      }
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
  async getTokenData(req, res, next) {
    try {

      console.log('Final Token Data', req.decode_data)
      if(req.user){
        res.status(200).json({
          message:'Token Data Get successfully',
          status: 'success',
          data: req.user,

        })

      }else{
        res.status(401).json({
          message: 'Something Went Wrong in Token',
          status: 'error'
        });

      }

    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }

  async getUserById(req, res, next) {

      try {
        const{ id } = req.params
        const result = await userService.getUserById(id); 
  
        // If login is successful, send success response with token
        if (result.success) {
          res.status(200).json({
            message: result.message,
            status: 'success',
            token: result.data
          });
        } else {
          // If login fails, send a 401 response with error message
          res.status(401).json({
            message: result.message,
            status: 'error'
          });
        }
      } catch (error) {
        next(error); // Pass the error to the next middleware
      }

    
  }

}

export default new UserController();
