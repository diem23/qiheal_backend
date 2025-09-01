import express from 'express';
import verifyRoles from '../middleware/verifyRoles';
import PostService from '../services/PostService';
import ProductService from '../services/ProductService';
import { OrderService } from '../services/OrderService';
import { ContactService } from '../services/ContactService';
import sendMail from '../helper/sendMail';
import VoucherService from '../services/VoucherService';
import { PaginationSetting } from '../Types/Pagination.props';
import PostRepo from '../repos/PostRepo';
import ProductRepo from '../repos/ProductRepo';
export const GuestRouter = express.Router();
// Search posts
GuestRouter.post("/post/search", async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $keyword: "Office Chair",
                $page: 1,
                $limit: 10
            }
        } 
        */
    const response = await PostService.handleSearch(req)
    res.status(200).json({
        message: "Get all posts successfully",
        count: response?.length,
        data: response,
    });
});
// Get all posts
GuestRouter.get("/post/", async (req, res) => {
    const response = await PostService.handleGetPosts(req)
    res.status(200).json({
        message: "Get all posts successfully",
        count: response?.length,
        data: response,
    });
});
// Get post by ID
GuestRouter.get("/post/:id", async (req, res) => {
    const reponse = await PostService.handleGetPostById(req)
    if

        (!reponse) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).send(reponse)
}
);
// Search products
GuestRouter.post('/product/search', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $keyword: "Office Chair",
                $page: 1,
                $limit: 10
            }
        } 
        */
    const response = await ProductService.handleSearch(req)
    res.status(200).json({
        message: 'Get all products successfully',
        count: response?.length,
        data: response,
    });
});
// Get products by pagination
GuestRouter.post('/product/pagination', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Get products by pagination',
            schema: { 
                page: 1,
                limit: 10
            }
        } 
    */
    const page = parseInt(req.body.page as string) || PaginationSetting.DEFAULT_PAGE;
    const limit = parseInt(req.body.limit as string) || PaginationSetting.DEFAULT_LIMIT;
    const response = await ProductService.handleGetByPagination(page, limit);
    const totalCount = await ProductRepo.getTotalCount();
    res.status(200).json({
        message: 'Get products by pagination successfully',
        count: response?.length,
        data: response,
        totalCount
    });
})

// Get posts by pagination
GuestRouter.post('/post/pagination', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Get posts by pagination',
            schema: { 
                page: 1,
                limit: 10
            }
        } 
    */
    const page = parseInt(req.body.page as string) || PaginationSetting.DEFAULT_PAGE;
    const limit = parseInt(req.body.limit as string) || PaginationSetting.DEFAULT_LIMIT;
    const response = await PostService.handleGetByPagination(page, limit);
    const totalCount = await PostRepo.getTotalCount();
    res.status(200).json({
        message: 'Get posts by pagination successfully',
        count: response?.length,
        data: response,
        totalCount
    });
})
   

// Get all products
GuestRouter.get('/product/', async(req,  res) => {
    const response = await ProductService.handleGetProducts(req)
    res.status(200).json({
        message: 'Get all products successfully',
        count: response?.length,
        data: response,
    });
});
// Get product by ID
GuestRouter.get('/product/:id', async (req, res) => {
    const reponse = await ProductService.handleGetProductById(req)
    if (!reponse) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).send(reponse)
});
GuestRouter.get('/product/slug/:slug', async (req, res) => {
    const response = await ProductService.handleGetProductBySlug(req)
    console.log(response);
    if (!response) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).send(response)
});
// Create a new order
GuestRouter.post('/order',async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new order',
            schema: { 
                $customer: "645b1f2e8f1b2c001c8e4d3a",
                $products: [
                    { product: "645b1f2e8f1b2c001c8e4d3b", quantity: 2 },
                    { product: "645b1f2e8f1b2c001c8e4d3c", quantity: 1 }
                ],
                $usedLoyalPoints: 100,
                $collaborator: "645b1f2e8f1b2c001c8e4d3d",
                $voucher: "TH_01",
                $totalPrice: 250.00,
                $phone: "1234567890",
                $fullname: "John Doe",
                $email: "johndoe@example.com",
                $province: "Hanoi",
                $district: "Hoan Kiem",
                $ward: "Cua Dong",
                $address: "123 Main St",
                $note: "Please deliver quickly",
            }
        } 
        */
    try {
    const voucherCode = req.body.voucher;
    delete req.body.voucher;
    const response = await OrderService.handleCreateOrder(req.body, voucherCode);
    await OrderService.handleSendMailAfterOrder( 'tuvanskhhvn@gmail.com', 'New Order Created', 
        {
            fullname: response?.fullname,
            orderCode: response?._id.toString(),
            totalPrice: response?.totalPrice,
            email: response?.email,
            phone: response?.phone,
            province: response?.province,
            district: response?.district,
            ward: response?.ward,
            address: response?.address,
            orderUrl: `${process.env.FRONTEND_URL}/admin/orders`
        });
    res.status(201).json({
        message: 'Order created successfully',
        data: response,
    });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// Get products by list of IDs
GuestRouter.post('/product/list', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Get products by list of IDs',
            schema: { 
                $productIds: ["645b1f2e8f1b2c001c8e4d3b", "645b1f2e8f1b2c001c8e4d3c"]
            }
        } 
        */
    try {
        const response = await ProductService.handleGetProductsByListOfIds(req.body.productIds);
        res.status(200).json({
            message: 'Get products by list of IDs successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error getting products by list of IDs',
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
GuestRouter.post('/contact', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a contact',
            schema: { 
                $fullname: "Nguyễn Minh Điềm",
                $phone: "1234567890",
                $email: "nmdiem23@gmail.com",
                $address: "123 Main St",
                $serviceType: "Advise on product",
                $note: "I need help with a product"
            }
        }
        */
    try {
        const response = await ContactService.handleCreateContact(req.body);
        res.status(201).json({
            message: 'Contact created successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating contact',
            error: error instanceof Error ? error.message : String(error),
        });
    }   
});
GuestRouter.get('/voucher/:code',   async (req, res) => {
    try {
        const voucher = await VoucherService.handleGetVoucherByCode(req.params.code);
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.status(200).json(voucher);
    } catch (error) {
        return res.status(500).json({   
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});