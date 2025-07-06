import express from 'express';
import { OrderService } from '../services/OrderService';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
import { Types } from 'mongoose';
export const OrderRouter = express.Router();
OrderRouter.get('/', async (req, res) => {
    // #swagger.tags = ['Order']
    const response = await OrderService.handleGetOrders();
    res.status(200).json({
        message: 'Get all orders successfully',
        count: response?.length,
        data: response,
    });
});
OrderRouter.get('/:id',  async (req, res) => {
    // #swagger.tags = ['Order']
    if (Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }
    const orderId = new Types.ObjectId(req.params.id);
    const response = await OrderService.handleGetOrderById(orderId);
    if (!response) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(response);
});
OrderRouter.put('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['Order']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update an order',
            schema: { 
                $status: "Approved",
            }
        }
        */
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const orderId = new Types.ObjectId(req.params.id);
        const response = await OrderService.handleUpdateOrder(orderId, req.body);
        if (!response) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: 'Order updated successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
OrderRouter.post('/approve',  async (req, res) => {
    // #swagger.tags = ['Order']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Approve an order',
            schema: { 
                $orderId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
    const response = await OrderService.handleApproveOrder(req.body.orderId);
    if (!response) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({
        message: 'Order approved successfully',
        data: response,
    });
});
OrderRouter.post('/cancle',  async (req, res) => {
    // #swagger.tags = ['Order']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Approve an order',
            schema: { 
                $orderId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
    const response = await OrderService.handleCancelOrder(req.body.orderId);
    if (!response) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({
        message: 'Order approved successfully',
        data: response,
    });
});
OrderRouter.delete('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const orderId = new Types.ObjectId(req.params.id);
        const response = await OrderService.handleDeleteOrder(orderId);
        if (!response) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
