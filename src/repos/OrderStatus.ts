import { Types } from "mongoose";
import { OrderStatusModel, OrderStatusName} from "../model/OrderStatus"; 
const getAll = async () => {
    // This function will retrieve all order statuses from the database
    const orderStatuses = await OrderStatusModel.find().exec();
    return orderStatuses;
}
const getById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific order status by its ID
    const orderStatus = await OrderStatusModel.findById(id).populate('nextStatus').exec();
    return orderStatus;
}
const create = async (orderStatus: any) => {
    // This function will create a new order status in the database
    const newOrderStatus = await OrderStatusModel.create(orderStatus);
    return newOrderStatus;
}
const update = async (id: Types.ObjectId, orderStatus: any) => {
    // This function will update an existing order status by its ID
    const updatedOrderStatus = await OrderStatusModel.findByIdAndUpdate(id, orderStatus, { new: true }).exec();
    return updatedOrderStatus;
}
const del = async (id: Types.ObjectId) => {
    // This function will delete an order status by its ID
    const deletedOrderStatus = await OrderStatusModel.findByIdAndDelete(id).exec();
    return deletedOrderStatus;
}
const getFirstStatus = async () => {
    // This function will retrieve the first order status in the workflow
    const firstStatus = await OrderStatusModel.findOne({ isFirstStatus: true }).exec();
    return firstStatus;
}
const getStatusByName = async (statusName: OrderStatusName) => {
    // This function will retrieve an order status by its name
    const orderStatus = await OrderStatusModel.findOne({ status: statusName }).exec();
    return orderStatus;
}
export const OrderStatusRepo = {
    getAll,
    getById,
    create,
    update,
    del,
    getFirstStatus,
    getStatusByName
};