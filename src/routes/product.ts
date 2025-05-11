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

    res.status(200).json({
        message: 'Get all products successfully',
        count: response?.length,
        data: response,
    });
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
    if (!reponse) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(reponse)
});
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                   type: string
 *                   description: The ID of the created product
 *                   example: "645b1f2e8f1b2c001c8e4d3b"
 *               name:
 *                 type: string
 *                 description: The name of the product
 *                 example: "Office Chair"
 *               desc:
 *                 type: string
 *                 description: The description of the product
 *                 example: "A comfortable office chair with adjustable height"
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 120.99
 *               stockQty:
 *                 type: number
 *                 description: The stock quantity of the product
 *                 example: 50
 *               warningLevel:
 *                 type: number
 *                 description: The warning level for low stock
 *                 example: 10
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category the product belongs to
 *                 example: "645b1f2e8f1b2c001c8e4d3a"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created product
 *                   example: "645b1f2e8f1b2c001c8e4d3b"
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 desc:
 *                   type: string
 *                   description: The description of the product
 *                 price:
 *                   type: number
 *                   description: The price of the product
 *                 stockQty:
 *                   type: number
 *                   description: The stock quantity of the product
 *                 warningLevel:
 *                   type: number
 *                   description: The warning level for low stock
 *                 categoryId:
 *                   type: string
 *                   description: The ID of the category the product belongs to
 *       400:
 *         description: Invalid input
 */
ProductRoute.post('/', async (req, res) => {
    //console.log('Request body:', req.body); // Debug log
    const response = await ProductService.handleCreateProduct(req)
    res.send(response)
}
);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     parameters:
*      - in: path
*        name: id
*        required: true
*        description: The id of the product to update
*        schema:
*        type: string
 *     summary: Update a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *                 example: "Office Chair"
 *               desc:
 *                 type: string
 *                 description: The description of the product
 *                 example: "A comfortable office chair with adjustable height"
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 120.99
 *               stockQty:
 *                 type: number
 *                 description: The stock quantity of the product
 *                 example: 50
 *               warningLevel:
 *                 type: number
 *                 description: The warning level for low stock
 *                 example: 10
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category the product belongs to
 *                 example: "645b1f2e8f1b2c001c8e4d3a"
 *     responses:
 *       201:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created product
 *                   example: "645b1f2e8f1b2c001c8e4d3b"
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 desc:
 *                   type: string
 *                   description: The description of the product
 *                 price:
 *                   type: number
 *                   description: The price of the product
 *                 stockQty:
 *                   type: number
 *                   description: The stock quantity of the product
 *                 warningLevel:
 *                   type: number
 *                   description: The warning level for low stock
 *                 categoryId:
 *                   type: string
 *                   description: The ID of the category the product belongs to
 *       400:
 *         description: Invalid input
 */
ProductRoute.put('/:id', async (req, res) => {
    //const updatedProduct: Product = req.body;
    const response = await ProductService.handleUpdateProduct(req)
    if (!response) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(response)
});
/**
    * @swagger
    * /products/{id}:
    *   delete:
    *     parameters:
    *      - in: path
    *        name: id
    *        required: true
    *        description: The id of the product to delete
    *        schema:
    *        type: string
    *     summary: Delete a product by id
    *     responses:
    *       200:
    *         description: delete a product
    */
ProductRoute.delete('/:id', async (req, res) => {
    const response = await ProductService.handleDeleteProduct(req)
    if (!response) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(response)
});

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     summary: Upload Base64 images and associate them with a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to associate the images with
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 encoded image string
 *                 example: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAA..."]
 *     responses:
 *       200:
 *         description: Images uploaded and associated with the product successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the product
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: List of Base64 encoded image strings associated with the product
 *       400:
 *         description: Invalid input (e.g., images not provided or not an array)
 *       500:
 *         description: Internal server error
 */
// Upload Base64 images and associate them with a product
ProductRoute.post('/:id/images', async (req, res) => {
    try {
        
        const { images } = req.body; // Expecting an array of Base64 strings

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'Images must be an array of Base64 strings' });
        }

        // Update the product with the new images
        const updatedProduct = await ProductService.addBase64ImagesToProduct(req);

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});
