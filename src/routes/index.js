import express from 'express';
import userController  from '../controller/userController.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ status: 'Node Express API is working' });
});

router.post('/create', userController.createUser);
// router.get('/get', postController.getPosts);
// router.delete('/delete/:id', postController.deletePost);
// router.put('/toggle/:id', postController.togglePost);

export default router;
