import express from "express";
import { CustomerService } from "../services/CustomerService";
import { OrderService } from "../services/OrderService";
import { UpdateMeProps } from "../Types/Me.props";
export const CustomerMeRouter = express.Router();
CustomerMeRouter.get("/personal-info", async (req: any, res) => {
    const customerId = req.user.customerId;
    const response = await CustomerService.handleGetCustomerById(customerId);
    if (!response) {
        return res.status(404).json({ message: "Không tìm thấy thông tin cá nhân" });
    }
    res.status(200).json({
        message: "Lấy thông tin cá nhân thành công",
        data: response,
    });
})
CustomerMeRouter.put("/personal-info", async (req: any, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update personal information',
            schema: { 
                $fullname: "john_doe",
                $phone: "0987654321",
                $email: "john_doe_updated@example.com"
            }
        }*/
    try {
        const customerId = req.user.customerId;
        if (!customerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const personalInfo: UpdateMeProps = {
            fullname: req.body.fullname,
            phone: req.body.phone,
        };
        console.log("Personal Info: ", personalInfo);
        const response = await CustomerService.handleUpdateCustomer(customerId, personalInfo);
        if (response) {
            return res.status(200).json({
                message: "Personal information updated successfully",
                data: response,
            });
        }
        return res.status(400).json({
            message: "Personal information update failed",
        });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
});
CustomerMeRouter.get("/orders", async (req: any, res) => {
    // #swagger.tags = ['CustomerMe']
    try{
    const customerId = req.user.customerId;
    if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const response = await OrderService.handleGetOrdersByCustomerId(customerId);
    if (!response) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng cho khách hàng này" });
    }
    res.status(200).json({
        message: "Lấy danh sách đơn hàng thành công",
        data: response,
    });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
});