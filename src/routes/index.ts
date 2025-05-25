import express from 'express';
import {ProductRoute} from './product';
import { PostRouter } from './post';
import { AuthenRouter } from './authen';
import jwtVerify from '../middleware/jwtVerify';
import { UserRoute } from './user';
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

export default router;

