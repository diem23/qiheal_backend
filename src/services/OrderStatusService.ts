import { Types } from "mongoose";
import OrderStatus from "../model/OrderStatus";
import { OrderStatusRepo } from "../repos/OrderStatus";

const handleCreateOrderStatus = async (orderStatus: OrderStatus) => {
    // This function will handle the creation of a new order status
    // It should validate the order status data and then call the repository to create the order status
    if (!orderStatus.status) {
        throw new Error("Order status is required");
    }
    const newOrderStatus = await OrderStatusRepo.create(orderStatus);
    if (!newOrderStatus) {
        throw new Error("Order status creation failed");
    }
    return newOrderStatus;
}
const handleGetOrderStatuses = async () => {
    // This function will retrieve all order statuses
    const orderStatuses = await OrderStatusRepo.getAll();
    if (!orderStatuses) {
        throw new Error("No order statuses found");
    }
    return orderStatuses;
}
const handleGetOrderStatusById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific order status by its ID
    const orderStatus = await OrderStatusRepo.getById(id);
    if (!orderStatus) {
        throw new Error("Order status not found");
    }
    return orderStatus;
}
const handleGetfirstStatus = async () => { 
    // This function will retrieve the first order status in the workflow
    const firstStatus = await OrderStatusRepo.getFirstStatus();
    if (!firstStatus) {
        throw new Error("First order status not found");
    }
    return firstStatus;
}
const handleUpdateOrderStatus = async (id: Types.ObjectId, orderStatus: OrderStatus) => {
    // This function will update an existing order status by its ID
    if (!orderStatus.status) {
        throw new Error("Order status is required");
    }
    const updatedOrderStatus = await OrderStatusRepo.update(id, orderStatus);
    if (!updatedOrderStatus) {
        throw new Error("Order status update failed");
    }
    return updatedOrderStatus;
}
const handleDeleteOrderStatus = async (id: Types.ObjectId) => {
    // This function will delete an order status by its ID
    const deletedOrderStatus = await OrderStatusRepo.del(id);
    if (!deletedOrderStatus) {
        throw new Error("Order status deletion failed");
    }
    return deletedOrderStatus;
}
export const OrderStatusService = {
    handleGetfirstStatus,
    handleCreateOrderStatus,
    handleGetOrderStatuses,
    handleGetOrderStatusById,
    handleUpdateOrderStatus,
    handleDeleteOrderStatus
};
