import express from 'express';
import {ProductRoute} from './product';
import { PostRouter } from './post';
const router = express.Router();
router.use('/products', ProductRoute);
router.use('/posts', PostRouter);
export default router;

