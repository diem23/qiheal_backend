import { Types } from "mongoose";
import { CustomerLevelModel } from "../model/CustomerLevel";

const getAll = async () => {
    const customerLevels = await CustomerLevelModel.find().sort({ threshold: 1 });
    return customerLevels;
}
const getById = async (id: Types.ObjectId) => {
    const customerLevel = await CustomerLevelModel.findById(id);
    return customerLevel;
}
const create = async (customerLevel: any) => {
    const newCustomerLevel = await CustomerLevelModel.create(customerLevel);
    return newCustomerLevel;
}
const update = async (id: Types.ObjectId, customerLevel: any) => {
    const updatedCustomerLevel = await CustomerLevelModel.findByIdAndUpdate(id, customerLevel, { new: true });
    return updatedCustomerLevel;
}
const del = async (id: Types.ObjectId) => {
    const deletedCustomerLevel = await CustomerLevelModel.findByIdAndDelete(id);
    return deletedCustomerLevel;
}
export const CustomerLevelRepo = {
    getAll,
    getById,
    create,
    update,
    del
}   