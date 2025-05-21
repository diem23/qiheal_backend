import express from 'express';
import {ProductRoute} from './product';
import { PostRouter } from './post';
import { AuthenRouter } from './authen';
import jwtVerify from '../middleware/jwtVerify';
const router = express.Router();
router.use('/authen', AuthenRouter)
router.use('/products', jwtVerify, ProductRoute);
router.use('/posts', jwtVerify, PostRouter);

export default router;

