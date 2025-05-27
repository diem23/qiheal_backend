import { Types } from "mongoose";
import Customer from "../model/Customer";
import { UserRole } from "../model/User";
import { CustomerService } from "../services/CustomerService";
import express from "express";
export const CustomerRouter = express.Router();

CustomerRouter.get("/", async (req, res) => {
    // #swagger.tags = ['Customer']
    const response = await CustomerService.handleGetCustomers();
    res.status(200).json({
        message: "Get all customers successfully",
        count: response?.length,
        data: response,
    });
});
CustomerRouter.get("/:id", async (req, res) => {
    // #swagger.tags = ['Customer']
    if (Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({
            message: "Invalid customer ID",
        });
    }
    const customerId = new Types.ObjectId(req.params.id);
    const response = await CustomerService.handleGetCustomerById(customerId);
    if (!response) {
        return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(response);
});
CustomerRouter.put("/:id", async (req, res) => {
    // #swagger.tags = ['Customer']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a customer',
            schema: { 
                $username: "john_doe_updated",
                $phone: "0987654321",
                $email: "hhhh@gmail.com",
                $levelId: "645b1f2e8f1b2c001c8e4d3a"
            }
        }
        */
    try {
        const customerData = {  
            phone: req.body.phone,
            email: req.body.email,
            levelId: req.body.levelId,
        };
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({
                message: "Invalid customer ID",
            });
        }
        const customerId = new Types.ObjectId( req.params.id);
        const response = await CustomerService.handleUpdateCustomer(customerId, customerData);
        if (response) {
            return res.status(200).json({
                message: "Customer updated successfully",
                data: response,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
CustomerRouter.delete("/:id", async (req, res) => {
    try{
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({
                message: "Invalid customer ID",
            });
        }
        const customerId = new Types.ObjectId(req.params.id);
        const response = await CustomerService.handleDeleteCustomer(customerId);
        if (response) {
            return res.status(200).json({
                message: "Customer deleted successfully",
            });
        }
        return res.status(400).json({
            message: "Customer deletion failed",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
