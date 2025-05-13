import express from 'express';
import {ProductRoute} from './product';
const router = express.Router();
router.use('/products', ProductRoute);
export default router;

