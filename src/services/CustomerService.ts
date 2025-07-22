import { Types } from "mongoose";
import Cart from "../model/Cart";
import Customer from "../model/Customer";
import User from "../model/User";
import { CustomerRepo } from "../repos/CustomerRepo";
import { CartService } from "./CartService";
import UserService from "./UserService";

const handleCustomerSignUp = async (customerData: Customer, userData: User) => {
    
    let existingCustomer = await UserService.handleGetUserByUserName(userData.username);
    if (existingCustomer) {
        throw new Error("Tên đang nhập đã tồn tại"); 
    }
    if (customerData.email) existingCustomer = await CustomerRepo.findByUserEmail(customerData.email);
    if (existingCustomer) {
        throw new Error("Email đã tồn tại");
    }
    if (customerData.phone) existingCustomer = await CustomerRepo.getByPhone(customerData.phone);
    if (existingCustomer) {
        throw new Error("Số điện thoại đã tồn tại");
    }   
    const user = await UserService.handleCreateUser(userData);

    if (!user) {
        throw new Error("Tạo người dùng thất bại");
    }
    try {
        customerData.user = user._id; // Assuming user._id is the ID of the created user
        const cart: Cart = {
            products: [],
            totalPrice: 0,
        };
        const newCart = await CartService.handleCreateCart(cart);
        try {
            if (!newCart) { 
                throw new Error("Tạo giỏ hàng thất bại");
            }
            customerData.cartId = newCart._id; // Assuming newCart._id is the ID of the created cart
            const newCustomer = await handleCreateCustomer(customerData);
            return newCustomer;
        }
        catch (error) {
            if (newCart) {
                await CartService.handleDeleteCart(newCart._id);
            }
            throw new Error(error instanceof Error ? error.message : String(error));
        }
        
        
        
    } catch (error) {
        if (user) {
            await UserService.handleDeleteUser(user.id);
        }
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
const handleCreateCustomer = async (customerData: Customer) => {
    const newCustomer = await CustomerRepo.create(customerData);
    if (!newCustomer) {
        throw new Error("Tạo khách hàng thất bại");
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
        throw new Error("Không tìm thấy khách hàng");
    }
    return customer;
}
const handleGetCustomerByEmail = async (email: string) => {
    const customer = await CustomerRepo.findByUserEmail(email);
    if (!customer) {
        throw new Error("Không tìm thấy khách hàng với email này");
    }
    return customer;
}
const handleGetCustomerByUserId = async (userId: Types.ObjectId) => {
    const customer = await CustomerRepo.findByUserId(userId);
    if (!customer) {
        throw new Error("Không tìm thấy khách hàng cho người dùng này");
    }
    return customer;
}
const handleUpdateCustomer = async (customerId: Types.ObjectId, customerData: Customer) => {
    const updatedCustomer = await CustomerRepo.update(customerId, customerData);
    if (!updatedCustomer) {
        throw new Error("Cập nhật khách hàng thất bại");
    }
    return updatedCustomer;
}
const handleDeleteCustomer = async (customerId: Types.ObjectId) => {
    const customer = await CustomerRepo.findById(customerId);
    if (!customer) {
        throw new Error("Không tìm thấy khách hàng");
    }
    if (customer.cartId) CartService.handleDeleteCart(customer.cartId); // Assuming the cart ID is the same as customer ID
    const deletedCustomer = await CustomerRepo.del(customerId);
    if (!deletedCustomer) {
        throw new Error("Xóa khách hàng thất bại");
    }
    return deletedCustomer;
}
const handleGetByPhone = async (phone: string) => {
    const customer = await CustomerRepo.getByPhone(phone);
    if (!customer) {
        throw new Error("Không tìm thấy khách hàng");
    }
    return customer;
}

export const CustomerService = {
    handleGetByPhone,
    handleGetCustomerByEmail,
    handleCustomerSignUp,
    handleCreateCustomer,
    handleGetCustomers,
    handleGetCustomerById,
    handleGetCustomerByUserId,
    handleUpdateCustomer,
    handleDeleteCustomer

}
