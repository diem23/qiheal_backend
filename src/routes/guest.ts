import express from 'express';
import verifyRoles from '../middleware/verifyRoles';
import PostService from '../services/PostService';
import ProductService from '../services/ProductService';
import { OrderService } from '../services/OrderService';
import { ContactService } from '../services/ContactService';
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
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(reponse)
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
                $totalPrice: 250.00,
                $phone: "1234567890",
                $province: "Hanoi",
                $district: "Hoan Kiem",
                $ward: "Cua Dong",
                $address: "123 Main St",
                $note: "Please deliver quickly",
            }
        } 
        */
    try {
    const response = await OrderService.handleCreateOrder(req.body);
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