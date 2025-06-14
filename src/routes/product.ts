import express from 'express';
import ProductService from '../services/ProductService';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';

import { Types } from 'mongoose';
import upload from '../services/UploadService';
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
    try{
        console.log("req.body: ", req.body);
        const response = await ProductService.handleCreateProduct(req.body)
        res.send(response)
    } catch (error) {
        console.error("create product error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }

}
);
ProductRouter.put('/',verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Product']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $id: "645b1f2e8f1b2c001c8e4d3a",
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
    const response = await ProductService.handleUpdateProduct(req.body)
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

// Upload single file using Multer
ProductRouter.post("/upload1/:id", upload.array("multFiles", 2), async (req, res) => {
      /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Some description...',
            collectionFormat: 'multi',
            items: { type: 'file' }
        } */
    if (Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }
    
   
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    req.files = req.files as Express.Multer.File[]; // Type assertion to ensure req.files is treated as an array
    const fileNameArray = req.files?.map(file => file.filename);
    const product = {
        _id: Types.ObjectId.createFromHexString(req.params.id),
        images: fileNameArray
    };
    const updatedProduct = await ProductService.handleUpdateProduct(product);
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send(updatedProduct);
});

ProductRouter.post('/related/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Product']
    /*
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add related products',
            schema: { 
                $id: "645b1f2e8f1b2c001c8e4d3a",
                $relatedProductIds: ["645b1f2e8f1b2c001c8e4d3a", "645b1f2e8f1b2c001c8e4d3b"]
            }
        } 
    */
    try {
        if (!Types.ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }
        const response = await ProductService.handleChooseRelatedProducts(req.body.id, req.body.relatedProductIds as Types.ObjectId[]);
        res.status(200).json({
            message: "Related products updated successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error updating related products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});


