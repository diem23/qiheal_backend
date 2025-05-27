import express from 'express';
import {ProductRoute} from './product';
import { PostRouter } from './post';
import { AuthenRouter } from './authen';
import jwtVerify from '../middleware/jwtVerify';
import { UserRoute } from './user';
import { CustomerRouter } from './customer';
import {  CartRouter } from './cart';
import { CustomerLevelRouter } from './customerLevel';
const router = express.Router();
router.use('/authen', AuthenRouter)
router.use('/products', jwtVerify, ProductRoute
    // #swagger.tags = ['Product']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/posts', jwtVerify, PostRouter
    // #swagger.tags = ['Post']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/users', jwtVerify, UserRoute
    // #swagger.tags = ['User']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/customers', jwtVerify, CustomerRouter
    // #swagger.tags = ['Customer']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/cart', jwtVerify, CartRouter
    // #swagger.tags = ['Cart']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/customerLevels', jwtVerify, CustomerLevelRouter
    // #swagger.tags = ['CustomerLevel']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

export default router;

