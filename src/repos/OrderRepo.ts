import { Types } from "mongoose";
import { OrderModel } from "../model/Order";


const getAll = async () => {
    // This function will retrieve all orders from the database
    const orders = await OrderModel.find().populate('customer').where('isActive', true).exec();
    return orders;
}
const getById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific order by its ID
    const order = await OrderModel.findById(id).populate({
        path: 'customer',
        populate: {
            path: 'levelId'
        }
    }).populate('products.product').populate('status').exec();
    return order;
}
const create = async (order: any) => {
    // This function will create a new order in the database
    const newOrder = await OrderModel.create(order);
    return newOrder;
}
const update = async (id: Types.ObjectId, order: any) => {
    // This function will update an existing order by its ID
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, order, { new: true })
    .populate('customer').populate('products.product').exec();
    return updatedOrder;
}
const del = async (id: Types.ObjectId) => {
    // This function will delete an order by its ID
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    return deletedOrder;
}   
const getByCustomerId = async (customerId: Types.ObjectId) => {
    // This function will retrieve all orders for a specific customer
    const orders = await OrderModel.find({ customer: customerId }).populate('customer').exec();
    return orders;
}
const getByCollaboratorId = async (collaboratorId: Types.ObjectId) => {
    // This function will retrieve all orders handled by a specific collaborator
    const orders = await OrderModel.find({ collaborator: collaboratorId }).populate('customer').exec();
    return orders;
}
export const OrderRepo = {
    getAll,
    getById,
    create,
    update,
    del,
    getByCustomerId,
    getByCollaboratorId,
};