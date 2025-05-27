import express from "express";
import { CustomerLevelService } from "../services/CustomerLevel";
import { Types } from "mongoose";
import verifyRoles from "../middleware/verifyRoles";
import { UserRole } from "../model/User";
export const CustomerLevelRouter = express.Router();
CustomerLevelRouter.get("/",verifyRoles(UserRole.ADMIN),  async (req, res) => {
    const response = await CustomerLevelService.handleGetCustomerLevels();
    res.status(200).json({
        message: "Get all customer levels successfully",
        count: response?.length,
        data: response,
    });
});
CustomerLevelRouter.get("/:id",verifyRoles(UserRole.ADMIN), async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({
            message: "Invalid customer level ID",
        });
    }
    const customerLevelId = new Types.ObjectId(req.params.id);
    const response = await CustomerLevelService.handleGetCustomerLevelById(customerLevelId);
    if (!response) {
        return res.status(404).json({ message: "Customer level not found" });
    }
    res.status(200).json(response);
});
CustomerLevelRouter.put("/:id",verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a customer level',
            schema: { 
                $code: "Gold",
                $discountPercent: 0.1,
                $threshold: 1000
            }
        }
        */
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({
                message: "Invalid customer level ID",
            });
        }
        const customerLevelId = new Types.ObjectId(req.params.id);
        const response = await CustomerLevelService.handleUpdateCustomerLevel(customerLevelId, req.body);
        if (response) {
            return res.status(200).json({
                message: "Customer level updated successfully",
                data: response,
            });
        }
        return res.status(400).json({
            message: "Customer level update failed",
        });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
});
CustomerLevelRouter.post("/",verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a customer level',
            schema: { 
                $code: "Gold",
                $discountPecent: 0.1,
                $threshold: 1000
            }
        }
        */
    try {
        const response = await CustomerLevelService.handleCreateCustomerLevel(req.body);
        if (response) {
            return res.status(201).json({
                message: "Customer level created successfully",
                data: response,
            });
        }
        return res.status(400).json({
            message: "Customer level creation failed",
        });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
});
CustomerLevelRouter.delete("/:id",verifyRoles(UserRole.ADMIN), async (req, res) => {
    if (Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({
            message: "Invalid customer level ID",
        });
    }
    const customerLevelId = new Types.ObjectId(req.params.id);
    const response = await CustomerLevelService.handleDeleteCustomerLevel(customerLevelId);
    if (response) {
        return res.status(200).json({
            message: "Customer level deleted successfully",
        });
    }
    return res.status(400).json({
        message: "Customer level deletion failed",
    });
});


