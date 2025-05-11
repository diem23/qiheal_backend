import express from 'express';
import {ProductRoute} from './product';
const router = express.Router();
router.use('/products', ProductRoute);

router.get('/hello', (req, res) => {
    res.send('Hello, world!');
});
//console.log('Exporting Router:', router); // Debug log
export default router;

