import { Types } from "mongoose";
import OrderStatus from "../model/OrderStatus";
import { OrderStatusRepo } from "../repos/OrderStatus";

const handleCreateOrderStatus = async (orderStatus: OrderStatus) => {
    // This function will handle the creation of a new order status
    // It should validate the order status data and then call the repository to create the order status
    if (!orderStatus.status) {
        throw new Error("Cần có trạng thái đơn hàng");
    }
    const newOrderStatus = await OrderStatusRepo.create(orderStatus);
    if (!newOrderStatus) {
        throw new Error("Tạo trạng thái đơn hàng thất bại");
    }
    return newOrderStatus;
}
const handleGetOrderStatuses = async () => {
    // This function will retrieve all order statuses
    const orderStatuses = await OrderStatusRepo.getAll();
    if (!orderStatuses) {
        throw new Error("Không tìm thấy trạng thái đơn hàng");
    }
    return orderStatuses;
}
const handleGetOrderStatusById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific order status by its ID
    const orderStatus = await OrderStatusRepo.getById(id);
    if (!orderStatus) {
        throw new Error("Không tìm thấy trạng thái đơn hàng");
    }
    return orderStatus;
}
const handleGetfirstStatus = async () => { 
    // This function will retrieve the first order status in the workflow
    const firstStatus = await OrderStatusRepo.getFirstStatus();
    if (!firstStatus) {
        throw new Error("Không tìm thấy trạng thái đơn hàng đầu tiên");
    }
    return firstStatus;
}
const handleUpdateOrderStatus = async (id: Types.ObjectId, orderStatus: OrderStatus) => {
    // This function will update an existing order status by its ID
    if (!orderStatus.status) {
        throw new Error("Cần có trạng thái đơn hàng");
    }
    const updatedOrderStatus = await OrderStatusRepo.update(id, orderStatus);
    if (!updatedOrderStatus) {
        throw new Error("Cập nhật trạng thái đơn hàng thất bại");
    }
    return updatedOrderStatus;
}
const handleDeleteOrderStatus = async (id: Types.ObjectId) => {
    // This function will delete an order status by its ID
    const deletedOrderStatus = await OrderStatusRepo.del(id);
    if (!deletedOrderStatus) {
        throw new Error("Xóa trạng thái đơn hàng thất bại");
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
