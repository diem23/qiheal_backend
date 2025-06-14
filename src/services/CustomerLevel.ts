import { Types } from "mongoose";
import CustomerLevel from "../model/CustomerLevel";
import { CustomerLevelRepo } from "../repos/CustomerLevelRepo";
import { UpdateType } from "../Types/UpdateType.prop";
import Customer from "../model/Customer";
import { CustomerService } from "./CustomerService";
import { SystemSettingsService } from "./SystemSettingsService";
import { PointConversionValue, SystemSettingName } from "../Types/SystemSettingTypes.props";

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
const handleUpdateLoyaltyPoints = async (customer: Customer, updateType: UpdateType, loyaltyPoints: number = 0, totalPrice: number = 0) => {
    if (!customer) {
        throw new Error("Customer not found");
    }

    const pointSetting = await SystemSettingsService.getSystemSettingByKey(SystemSettingName.POINT_CONVERSION);
    const customerId = customer._id as Types.ObjectId;
    pointSetting.value = pointSetting.value as PointConversionValue; // Ensure pointSetting has a value
    
    if (!customer.usedLoyalPoints) customer.usedLoyalPoints = 0; // Initialize usedLoyalPoints if not present
    if (!customer.currentLoyalPoints) customer.currentLoyalPoints = 0; // Initialize currentLoyalPoints if not present
    
    const modifyingLoyaltyPoints = (totalPrice > 0) ? Math.floor(totalPrice / (pointSetting.value.moneyPerDiscount as number) * (pointSetting.value.pointConversion as number)) : loyaltyPoints; // Use provided loyalty points or current used points
    
    if (updateType === UpdateType.INCREASE) {
         // Ensure customer ID is of type ObjectId
        if (totalPrice > 0) customer.usedLoyalPoints += modifyingLoyaltyPoints; // Add used loyalty points to customer
        customer.currentLoyalPoints += modifyingLoyaltyPoints; // Add current loyalty points to customer
    }
    else if (updateType === UpdateType.DECREASE) {
        if ( customer.usedLoyalPoints < modifyingLoyaltyPoints) {
            throw new Error("Insufficient loyalty points to decrease");
        }
        if (totalPrice > 0) customer.usedLoyalPoints -= modifyingLoyaltyPoints; // Subtract used loyalty points from customer
        customer.currentLoyalPoints -= modifyingLoyaltyPoints; // Subtract current loyalty points from customer
    }
    
    const newCustomerLevel = await CustomerLevelService.handleGetByThreshold(customer.usedLoyalPoints) // Ensure levelId is of type CustomerLevel
    if (newCustomerLevel) {
        customer.levelId = newCustomerLevel; // Update customer level if applicable
    }
    customer = await CustomerService.handleUpdateCustomer(customerId, customer); // Update customer with new loyalty points and level
}
export const CustomerLevelService = {
    handleUpdateLoyaltyPoints,
    handleCreateCustomerLevel,
    handleGetCustomerLevels,
    handleGetCustomerLevelById,
    handleUpdateCustomerLevel,
    handleDeleteCustomerLevel,
    handleGetByThreshold
};