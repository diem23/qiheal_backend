import express from 'express';
import ProductService from '../services/ProductService';
import Product from '../model/Product';
export const ProductRoute=express.Router()
/**
    * @swagger
    * /products:
    *   get:
    *     summary: Retrieve a list of products
    *     responses:
    *       200:
    *         description: A list of products
    */
ProductRoute.get('/', async(req,  res) => {
    const response = await ProductService.handleGetProducts(req)
    
    console.log('Response:', response); // Debug log
    res.status(200).json(response);
});
/**
    * @swagger
    * /products/{id}:
    *   get:
    *     parameters:
    *      - in: path
    *        name: id
    *        required: true
    *        description: The id of the product to retrieve
    *        schema:
    *        type: string
    *     summary: Retrieve a product by id
    *     responses:
    *       200:
    *         description: a product
    */
ProductRoute.get('/:id', async (req, res) => {
    const reponse = await ProductService.handleGetProductById(req)
    console.log('Response:', reponse); // Debug log
    res.send(reponse)
});
ProductRoute.post('/', (req, res) => {
    const newProduct: Product = req.body;
    const response = ProductService.handleCreateProduct(req)
    res.send(response)
}
);
ProductRoute.put('/:id', (req, res) => {
    const updatedProduct: Product = req.body;
    const response = ProductService.handleUpdateProduct(req)
    res.send(response)
});
ProductRoute.delete('/:id', (req, res) => {
    const response = ProductService.handleDeleteProduct(req)
    res.send(response)
});

