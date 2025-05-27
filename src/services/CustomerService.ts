import { Types } from "mongoose";
import Cart from "../model/Cart";
import Customer from "../model/Customer";
import User from "../model/User";
import { CustomerLevelRepo } from "../repos/CustomerLevelRepo";
import { CustomerRepo } from "../repos/CustomerRepo";
import UserRepo from "../repos/UserRepo";
import { CartService } from "./CartService";
import UserService from "./UserService";

const handleCustomerSignUp = async (customerData: Customer, userData: User) => {
    // if (!customerData.levelId){
    //     const listCustomerLevel = await CustomerLevelRepo.getAll(); // Ensure levelId is optional
    //     if (listCustomerLevel.length > 0) {
    //         customerData.levelId = listCustomerLevel[0]._id; // Assign the first level if not provided
    //     } else {
    //         throw new Error("No customer levels available");
    //     }
    // }
    console.log("User Data:", userData);
    const user = await UserService.handleCreateUser(userData);

    if (!user) {
        throw new Error("User creation failed");
    }
    
    customerData.user = user._id; // Assuming user._id is the ID of the created user
    const cart: Cart = {
        products: [],
        totalPrice: 0,
    };
    const newCart = await CartService.handleCreateCart(cart);
    if (!newCart) { 
        throw new Error("Cart creation failed");
    }
    customerData.cartId = newCart._id; // Assuming newCart._id is the ID of the created cart
    const newCustomer = await handleCreateCustomer(customerData);
    
    
    return newCustomer;
}
const handleCreateCustomer = async (customerData: Customer) => {
    const newCustomer = await CustomerRepo.create(customerData);
    if (!newCustomer) {
        throw new Error("Customer creation failed");
    }
    return newCustomer;
}
const handleGetCustomers = async () => {
    const customers = await CustomerRepo.getAll();
    return customers;
}
const handleGetCustomerById = async (customerId: Types.ObjectId) => {
    const customer = await CustomerRepo.findById(customerId);
    if (!customer) {
        throw new Error("Customer not found");
    }
    return customer;
}
const handleGetCustomerByUserId = async (userId: Types.ObjectId) => {
    const customer = await CustomerRepo.findByUserId(userId);
    if (!customer) {
        throw new Error("Customer not found for this user");
    }
    return customer;
}
const handleUpdateCustomer = async (customerId: Types.ObjectId, customerData: any) => {
    const updatedCustomer = await CustomerRepo.update(customerId, customerData);
    if (!updatedCustomer) {
        throw new Error("Customer update failed");
    }
    return updatedCustomer;
}
const handleDeleteCustomer = async (customerId: Types.ObjectId) => {
    const customer = await CustomerRepo.findById(customerId);
    if (!customer) {
        throw new Error("Customer not found");
    }
    if (customer.cartId) CartService.handleDeleteCart(customer.cartId); // Assuming the cart ID is the same as customer ID
    const deletedCustomer = await CustomerRepo.del(customerId);
    if (!deletedCustomer) {
        throw new Error("Customer deletion failed");
    }
    return deletedCustomer;
}
export const CustomerService = {
    handleCustomerSignUp,
    handleCreateCustomer,
    handleGetCustomers,
    handleGetCustomerById,
    handleGetCustomerByUserId,
    handleUpdateCustomer,
    handleDeleteCustomer

}
