import express from 'express';
import { OrderStatusService } from '../services/OrderStatusService';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
import { Types } from 'mongoose';
export const OrderStatusRouter = express.Router();
OrderStatusRouter.get('/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    const response = await OrderStatusService.handleGetOrderStatuses();
    res.status(200).json({
        message: 'Get all order statuses successfully',
        count: response?.length,
        data: response,
    });
});
OrderStatusRouter.get('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order status ID' });
        }
        const orderStatusId = new Types.ObjectId(req.params.id );
        const response = await OrderStatusService.handleGetOrderStatusById(orderStatusId);
        if (!response) {
            return res.status(404).json({ message: 'Order status not found' });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error:   error instanceof Error ? error.message : String(error),
        });
    }
});
OrderStatusRouter.post('/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new order status',
            schema: { 
                $status: "pending",
                $nextStatus: "60c72b2f9b1e8b001c8e4d3a" ,
                $isFirstState: false
            }
        } 
        */
    try {
        const response = await OrderStatusService.handleCreateOrderStatus(req.body);
        res.status(201).json({
            message: 'Order status created successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
OrderStatusRouter.put('/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new order status',
            schema: { 
                $id: "60c72b2f9b1e8b001c8e4d3a",
                $status: "pending",
                $nextStatus: "60c72b2f9b1e8b001c8e4d3a" ,
                $isFirstStatus: false
            }
        } 
        */
    try {
        if (!Types.ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ message: 'Invalid order status ID' });
        }
        const orderStatusId = new Types.ObjectId(req.body.id);
        const response = await OrderStatusService.handleUpdateOrderStatus( orderStatusId,req.body);
        res.status(200).json({
            message: 'Order status updated successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
OrderStatusRouter.delete('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order status ID' });
        }
        const orderStatusId = new Types.ObjectId(req.params.id);
        const response = await OrderStatusService.handleDeleteOrderStatus(orderStatusId);
        res.status(200).json({
            message: 'Order status deleted successfully',
            data: response,
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

