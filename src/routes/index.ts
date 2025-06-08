import express from 'express';
import { ProductRouter} from './product';
import { PostRouter } from './post';
import { AuthenRouter } from './authen';
import jwtVerify from '../middleware/jwtVerify';
import { UserRoute } from './user';
import { CustomerRouter } from './customer';
import {  CartRouter } from './cart';
import { CustomerLevelRouter } from './customerLevel';
import { GuestRouter } from './guest';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
import { OrderRouter } from './order';
import { OrderStatusRouter } from './orderStatus';
import { UploadRouter } from './upload';
import upload from '../services/upload.service';
import { uploadImage } from './upload.controller';

const router = express.Router();
router.use('/authen', AuthenRouter
    // #swagger.tags = ['Authen']
);
router.use('/guest', GuestRouter
    // #swagger.tags = ['Guest']
);

// Public upload route không cần xác thực (chỉ để test)
/**
 * @swagger
 * /api/public-upload:
 *   post:
 *     tags: [Upload]
 *     description: Endpoint công khai để test upload một hình ảnh (không cần xác thực)
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: File hình ảnh cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         schema:
 *           $ref: '#/definitions/UploadResponse'
 */
router.post('/public-upload', upload.single('image'), uploadImage);

router.use('/products', jwtVerify,verifyRoles(UserRole.ADMIN), ProductRouter
    // #swagger.tags = ['Product']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/posts', jwtVerify, verifyRoles(UserRole.ADMIN), PostRouter
    // #swagger.tags = ['Post']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/users', jwtVerify,verifyRoles(UserRole.ADMIN), UserRoute
    // #swagger.tags = ['User']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/customers', jwtVerify, verifyRoles(UserRole.ADMIN), CustomerRouter
    // #swagger.tags = ['Customer']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/cart', jwtVerify, verifyRoles(UserRole.ADMIN), CartRouter
    // #swagger.tags = ['Cart']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/customerLevels', jwtVerify, verifyRoles(UserRole.ADMIN), CustomerLevelRouter
    // #swagger.tags = ['CustomerLevel']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/orders', jwtVerify, verifyRoles(UserRole.ADMIN), OrderRouter
    // #swagger.tags = ['Order']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/orderStatuses', jwtVerify, verifyRoles(UserRole.ADMIN), OrderStatusRouter
    // #swagger.tags = ['OrderStatus']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
router.use('/upload', jwtVerify, verifyRoles(UserRole.ADMIN), UploadRouter
    // #swagger.tags = ['Upload']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
);
export default router;

