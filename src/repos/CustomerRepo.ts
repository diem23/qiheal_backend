import { Types } from "mongoose";
import Customer, { CustomerModel } from "../model/Customer";

const create = async (customer: Customer) => {
    const newCustomer = await CustomerModel.create(customer);
    return newCustomer;
}
const findById = async (id: Types.ObjectId) => {
    const customer = await CustomerModel.findById(id).populate("user").populate("levelId").populate("cartId");
    return customer;
}
const findByUserId = async (userId: Types.ObjectId) => {
    const customer = await CustomerModel.findOne({ user: userId }).populate("user").populate("levelId");
    return customer;
}
const findByUserEmail = async (email: string) => {
    const customer = await CustomerModel.findOne({ email: email }).populate("user").populate("levelId");
    return customer;
}
const findByUserName = async (username: string) => {
    const customer = await CustomerModel.findOne({ "user.username": username })
        .populate("user")
        .populate("levelId");
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
const getByPhone = async (phone: string) => {
    const customer = await CustomerModel.findOne({ phone }).populate("user").populate("levelId");
    return customer;
}
export const  CustomerRepo = {
    getByPhone,
    findByUserEmail,
    findByUserName,
    create,
    findById,
    findByUserId,
    update,
    del,
    getAll
}