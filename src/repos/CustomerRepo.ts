import { Types } from "mongoose";
import Customer, { CustomerModel } from "../model/Customer";

const create = async (customer: Customer) => {
    const newCustomer = await CustomerModel.create(customer);
    return newCustomer;
}
const findById = async (id: Types.ObjectId) => {
    const customer = await CustomerModel.findById(id).populate("user").populate("levelId");
    return customer;
}
const findByUserId = async (userId: Types.ObjectId) => {
    const customer = await CustomerModel.findOne({ user: userId }).populate("user").populate("levelId");
    return customer;
}
const update = async (id: Types.ObjectId, customer: any) => {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(id, customer, { new: true }).populate("user").populate("levelId");
    return updatedCustomer;
}
const del = async (id: Types.ObjectId) => {
    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);
    return deletedCustomer;
}
const getAll = async () => {
    const customers = await CustomerModel.find().populate("user").populate("levelId");
    return customers;
}
export const  CustomerRepo = {
    create,
    findById,
    findByUserId,
    update,
    del,
    getAll
}