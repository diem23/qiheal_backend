import { Types } from "mongoose";
import { OrderData } from "../Types/Order.props";
import { OrderRepo } from "../repos/OrderRepo";
import { CustomerService } from "./CustomerService";
import Product from "../model/Product";
import Customer from "../model/Customer";
import CustomerLevel from "../model/CustomerLevel";
import { CustomerLevelService } from "./CustomerLevel";
import OrderStatus, { OrderStatusName } from "../model/OrderStatus";
import Order from "../model/Order";
import { OrderStatusRepo } from "../repos/OrderStatus";
const calTotalPrice = async (orderId: Types.ObjectId) => {
    let order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    let totalPrice = order.products.reduce((total, item) => {
        item.product = item.product as Product; // Ensure item.product is of type Product
        return total + (item.product.actualPrice ? item.product.actualPrice : 0) * item.quantity;
    }, 0);
    totalPrice -= order.usedLoyalPoints ? order.usedLoyalPoints : 0; // Deduct used loyalty points if any
    if (order.customer) {
        order.customer = order.customer as Customer;
        if (order.customer.levelId) {
            order.customer.levelId = order.customer.levelId as CustomerLevel; // Ensure levelId is of type with discount
            totalPrice -= totalPrice * order.customer.levelId.discountPercent; // Apply customer level discount if any
        }
    }
    return totalPrice;
}
const handleCreateOrder = async (orderData: Order ) => {
    // This function will handle the creation of a new order
    // It should validate the order data and then call the repository to create the order
    
    let customer: Customer | null = null;
    if (!orderData.phone){
        if (!orderData.customer) {
            throw new Error("Phone or customer ID is required to create an order");
        }
        customer = await CustomerService.handleGetCustomerById(orderData.customer as Types.ObjectId);
        orderData.phone = customer.phone as string; // Use customer's phone if not provided
    }
    console.log("Customer data:", customer);
    // Check to minus current loyalty points of customer
    if (customer){
        
        if (orderData.usedLoyalPoints && customer.currentLoyalPoints){
            customer.currentLoyalPoints -=   orderData.usedLoyalPoints ; // Update used loyalty points
            if (customer.currentLoyalPoints < 0) {
                throw new Error("Insufficient loyalty points");
            }
            console.log("Customer current loyalty points after deduction:", customer.currentLoyalPoints);
            await CustomerService.handleUpdateCustomer(customer._id as Types.ObjectId, customer); // Update customer with new loyalty points
        }
    }
    orderData.customer = customer?._id; // Ensure customer is of type ObjectId
    const firstStatus = await OrderStatusRepo.getFirstStatus(); // Get the first status for the order
    if (!firstStatus) {
        throw new Error("First order status not found");
    }
    orderData.status = firstStatus._id; // Set the order status to the first status
    console.log("Order data received for creation:", orderData);
    // validate collaborator
    let newOrder = await OrderRepo.create(orderData);
    if (!newOrder) {
        throw new Error("Order creation failed");
    }
    // Calculate total price
    newOrder.totalPrice = await calTotalPrice(newOrder._id);
    return newOrder;
}
const handleGetOrders = async () => {
    // This function will retrieve all orders from the repository
    const orders = await OrderRepo.getAll();
    return orders;
}
const handleGetOrderById = async (orderId: Types.ObjectId) => {
    // This function will retrieve a specific order by its ID
    const order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
//need more fix
const handleApproveOrder = async (orderId: Types.ObjectId) => {
    // This function will approve an order by its ID
    let order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    order.status = order.status as OrderStatus; // Ensure order status is of type OrderStatus
    const nextStatus = await OrderStatusRepo.getById(order.status.nextStatus as Types.ObjectId); // Get the next status for the order
    if (!nextStatus) {
        throw new Error("Next order status not found");
    }
    if (nextStatus?.status == OrderStatusName.PACKAGING && order.customer) {
        await handleConfirmOrder(order); // Handle confirm order if status is packaging
    }
    order.status = nextStatus; // Update order status to the next status
    const updatedOrder = await OrderRepo.update(orderId, order); // Update the order in the repository  
    if (!updatedOrder) {
        throw new Error("Order update failed");
    }
    return updatedOrder;
}
// if the order status changes to packaging from pending, we need to update 
// the used loyalty points of the customer to update the customer level (if applicable)
const handleConfirmOrder = async (order: Order) => {
    // Check to update used loyalty points of customer
    let customer : Customer | null = null;
    order.customer = order.customer as Customer; // Ensure customer is of type Customer
    if (order.customer.usedLoyalPoints && order.customer.usedLoyalPoints > 0) {
        const customerId = order.customer._id as Types.ObjectId; // Ensure customer ID is of type ObjectId
        order.customer.usedLoyalPoints += order.usedLoyalPoints ? order.usedLoyalPoints : 0; // Add used loyalty points to customer
        // Check if customer level needs to be updated based on new loyalty points
        const newCustomerLevel = await CustomerLevelService.handleGetByThreshold(order.customer.usedLoyalPoints) // Ensure levelId is of type CustomerLevel
        if (newCustomerLevel) {
            order.customer.levelId = newCustomerLevel; // Update customer level if applicable
        }
        customer = await CustomerService.handleUpdateCustomer(customerId, order.customer); // Update customer with new loyalty points and level
    }
    //order.status = OrderStatus.PACKAGING; // Change status to packaging
    //const updatedOrder = await OrderRepo.update(orderId, order);
    return customer;
}
// This function will cancel an order by its ID
const handleCancelOrder = async (orderId: Types.ObjectId) => {
    // This function will cancel an order by its ID
    let order = await OrderRepo.getById(orderId);
    let customer : Customer | null = null;
    if (!order) {
        throw new Error("Order not found");
    }
    order.status = order.status as OrderStatus; // Ensure order status is of type OrderStatus
    if (order.status.status == OrderStatusName.PAID) {
        throw new Error("Cannot cancel a paid order");
    }
    // Case where the order is not pending, we need to refund loyalty points if used
    if (order.status.status !== OrderStatusName.PENDING) {
        order.customer = order.customer as Customer; // Ensure customer is of type Customer
        if (order.usedLoyalPoints && order.usedLoyalPoints > 0) {
            // If the order has used loyalty points, refund them to the customer
            if (order.customer.usedLoyalPoints) {
                order.customer.usedLoyalPoints = order.customer.usedLoyalPoints - order.usedLoyalPoints ;
                const customerLevel = await CustomerLevelService.handleGetByThreshold(order.customer.usedLoyalPoints); // Get customer level by threshold
                if (customerLevel) {
                    order.customer.levelId = customerLevel._id; // Update customer level if applicable
                }
                order.customer.currentLoyalPoints = order.customer.currentLoyalPoints ? order.customer.currentLoyalPoints + order.usedLoyalPoints : order.usedLoyalPoints; // Refund loyalty points
                customer = await CustomerService.handleUpdateCustomer(order.customer._id as Types.ObjectId, order.customer); // Update customer with refunded loyalty points
            }
        }
    }
    const cancelledStatus = await OrderStatusRepo.getStatusByName(OrderStatusName.CANCELLED); // Get the cancelled status
    if (!cancelledStatus) {
        throw new Error("Cancelled order status not found");
    }
    order.status = cancelledStatus; // Update order status to cancelled
    const updatedOrder = await OrderRepo.update(orderId, order); // Update the order in the repository
    return updatedOrder;
}
const handleDeleteOrder = async (orderId: Types.ObjectId) => {
    // This function will delete an order by its ID
    const deletedOrder = await OrderRepo.del(orderId);
    if (!deletedOrder) {
        throw new Error("Order deletion failed");
    }
    return deletedOrder;
}
export const OrderService = {
    handleCreateOrder,
    handleGetOrders,
    handleGetOrderById,
    handleApproveOrder,
    handleCancelOrder,
    calTotalPrice,
    handleDeleteOrder,
};