import express from 'express';
import verifyRoles from '../middleware/verifyRoles';
import PostService from '../services/PostService';
import ProductService from '../services/ProductService';
export const GuestRouter = express.Router();
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
GuestRouter.get("/post/", async (req, res) => {
    const response = await PostService.handleGetPosts(req)
    res.status(200).json({
        message: "Get all posts successfully",
        count: response?.length,
        data: response,
    });
});
GuestRouter.get("/post/:id", async (req, res) => {
    const reponse = await PostService.handleGetPostById(req)
    if

        (!reponse) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).send(reponse)
}
);
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
GuestRouter.get('/product/', async(req,  res) => {
    const response = await ProductService.handleGetProducts(req)
    res.status(200).json({
        message: 'Get all products successfully',
        count: response?.length,
        data: response,
    });
});
GuestRouter.get('/product/:id', async (req, res) => {
    const reponse = await ProductService.handleGetProductById(req)
    if (!reponse) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(reponse)
});