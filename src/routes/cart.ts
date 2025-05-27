import express from "express";
export const CartRouter = express.Router();
import { CartService } from "../services/CartService";
import { Types } from "mongoose";
CartRouter.get("/", async (req, res) => {
    const response = await CartService.handleGetCarts();
    res.status(200).json({
        message: "Get all carts successfully",
        count: response?.length,
        data: response,
    });
});
CartRouter.get("/:id", async (req, res) => {
    try{
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({
                message: "Invalid cart ID",
            });
        }
        const cartId = new Types.ObjectId(req.params.id);
        const response = await CartService.handleGetCartById(cartId);
        if (!response) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
});
CartRouter.put("/:id", async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a cart',
            schema: 
                {
                    "products": [
                        {
                            "product": "645b1f2e8f1b2c001c8e4d3a",
                            "quantity": 2
                        },
                        {
                            "product": "645b1f2e8f1b2c001c8e4d3b",
                            "quantity": 3
                        }
                    ]
                }
            
        }
        */
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({
                message: "Invalid cart ID",
            });
        }
        const cartId = new Types.ObjectId(req.params.id);
        const response = await CartService.handleUpdateCart(cartId, req.body);
        if (response) {
            return res.status(200).json({
                message: "Cart updated successfully",
                data: response,
            });
        }
        return res.status(400).json({
            message: "Cart update failed",
        });
    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});