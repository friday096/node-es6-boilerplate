import express from 'express';
import userController  from '../controller/userController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ status: 'API is working' });
});

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/forget', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);
router.get('/getTokenData', authMiddleware, userController.getTokenData); 
router.get('/user/:id', authMiddleware, userController.getUserById); 

export default router;
