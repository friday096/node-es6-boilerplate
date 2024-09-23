import express from 'express';
import userController  from '../controller/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ status: 'API is working' });
});

router.get('/user', authMiddleware, userController.createUser);


export default router;
