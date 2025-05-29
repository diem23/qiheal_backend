import express from 'express';
import ProductService from '../services/ProductService';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
export const ProductRouter=express.Router()

ProductRouter.post('/',verifyRoles(UserRole.ADMIN), async (req, res) => {
     
        // #swagger.tags = ['Product']
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $name: "Office Chair",
                $desc: "A comfortable office chair with adjustable height",
                $price: 120.99,
                $stockQty: 50,
                $slug: "office-chair",
                $actualPrice: 100.99,
                $warningLevel: 10,
                $images: ["public_id1", "public_id2"],
                $categoryId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
       
        console.log("req.body: ", req.body);
    const response = await ProductService.handleCreateProduct(req)
    res.send(response)
}
);
ProductRouter.put('/:id',verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Product']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $name: "Office Chair",
                $desc: "A comfortable office chair with adjustable height",
                $price: 120.99,
                $stockQty: 50,
                $slug: "office-chair",
                $actualPrice: 100.99,
                $warningLevel: 10,
                $images: ["public_id1", "public_id2"],
                $categoryId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
    const response = await ProductService.handleUpdateProduct(req)
    if (!response) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(response)
});
ProductRouter.delete('/:id',verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Product']
    const response = await ProductService.handleDeleteProduct(req)
    if (!response) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(response)
});
ProductRouter.post('/upload/:id',verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Product']
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['files'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Some description...',
            collectionFormat: 'multi',
            items: { type: 'file' }
        } */
    const response = await ProductService.addBase64ImagesToProduct(req)
    res.status(200).send(response)
});

