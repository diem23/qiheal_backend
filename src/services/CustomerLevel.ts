import { Types } from "mongoose";
import CustomerLevel from "../model/CustomerLevel";
import { CustomerLevelRepo } from "../repos/CustomerLevelRepo";

const handleCreateCustomerLevel = async (customerLevel: CustomerLevel) => {
    // Here you would typically call your CustomerLevelRepo.create method
    // For example:
    // const newCustomerLevel = await CustomerLevelRepo.create(customerLevel);
    
    // Simulating the create operation
    const newCustomerLevel = CustomerLevelRepo.create(customerLevel);
    if (!newCustomerLevel) {
        throw new Error("Customer Level creation failed");
    }
    return newCustomerLevel;
}
const handleGetCustomerLevels = async () => {
    // Here you would typically call your CustomerLevelRepo.getAll method
    // For example:
    // const customerLevels = await CustomerLevelRepo.getAll();
    
    // Simulating the get operation
    const customerLevels = CustomerLevelRepo.getAll();
    return customerLevels;
}
const handleGetCustomerLevelById = async (customerLevelId: Types.ObjectId) => {
    // Here you would typically call your CustomerLevelRepo.getById method
    // For example:
    // const customerLevel = await CustomerLevelRepo.getById(customerLevelId);
    
    // Simulating the get operation
    const customerLevel = CustomerLevelRepo.getById(customerLevelId);
    if (!customerLevel) {
        throw new Error("Customer Level not found");
    }
    return customerLevel;
}
const handleUpdateCustomerLevel = async (customerLevelId: Types.ObjectId, customerLevel: CustomerLevel) => {
    // Here you would typically call your CustomerLevelRepo.update method
    // For example:
    // const updatedCustomerLevel = await CustomerLevelRepo.update(customerLevelId, customerLevel);
    
    // Simulating the update operation
    const updatedCustomerLevel = CustomerLevelRepo.update(customerLevelId, customerLevel);
    if (!updatedCustomerLevel) {
        throw new Error("Customer Level update failed");
    }
    return updatedCustomerLevel;
}
const handleDeleteCustomerLevel = async (customerLevelId: Types.ObjectId) => {
    // Here you would typically call your CustomerLevelRepo.del method
    // For example:
    // const deletedCustomerLevel = await CustomerLevelRepo.del(customerLevelId);
    
    // Simulating the delete operation
    const deletedCustomerLevel = CustomerLevelRepo.del(customerLevelId);
    if (!deletedCustomerLevel) {
        throw new Error("Customer Level deletion failed");
    }
    return deletedCustomerLevel;
}
const handleGetByThreshold = async (threshold: number) => {
    // This function will retrieve customer levels by a specific threshold
    const customerLevels = await CustomerLevelRepo.getAll();
    if (!customerLevels || customerLevels.length === 0) {
        throw new Error("No customer levels found");
    }
    if (customerLevels[customerLevels.length - 1].threshold){
        if (threshold > (customerLevels[customerLevels.length - 1].threshold as number)) {
            return customerLevels[customerLevels.length - 1];
        }
    }
    const customerLevel = customerLevels.find(level => level.threshold && level.threshold <= threshold);
    return customerLevel;
}
export const CustomerLevelService = {
    handleCreateCustomerLevel,
    handleGetCustomerLevels,
    handleGetCustomerLevelById,
    handleUpdateCustomerLevel,
    handleDeleteCustomerLevel,
    handleGetByThreshold
};