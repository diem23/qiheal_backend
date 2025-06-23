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
import { OrderStatusService } from "./OrderStatusService";
import ProductService from "./ProductService";
import { UpdateType } from "../Types/UpdateType.prop";
import VoucherService from "./VoucherService";
import { ConversionType, SystemSettingsService } from "./SystemSettingsService";
const calTotalPrice = async (orderId: Types.ObjectId) => {
    const order = await OrderRepo.getById(orderId); // Retrieve the order by ID
    if (!order) {
        throw new Error("Order not found");
    }
    let totalPrice = order.products.reduce((total, item) => {
        item.product = item.product as Product; // Ensure item.product is of type Product
        return total + (item.product.actualPrice ? item.product.actualPrice : 0) * item.quantity;
    }, 0);
    totalPrice -= order.usedLoyalPoints ? await SystemSettingsService.pointAndMoneyConversion(ConversionType.POINT_TO_MONEY, 0, order.usedLoyalPoints) : 0; // Deduct used loyalty points if any
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
    customer = await CustomerService.handleGetCustomerById(orderData.customer as Types.ObjectId);
    if (!orderData.phone){
        if (!customer) {
            throw new Error("Phone or customer ID is required to create an order");
        }
        orderData.phone = customer.phone as string; // Use customer's phone if not provided
    }
    // Check to minus current loyalty points of customer
    if (customer){
        CustomerLevelService.handleUpdateLoyaltyPoints(customer, UpdateType.DECREASE, orderData.usedLoyalPoints , 0); // Update loyalty points of customer

    }

    
    

    const firstStatus = await OrderStatusService.handleGetfirstStatus(); // Get the first status for the order
    orderData.status = firstStatus._id; // Set the order status to the first status
    
    //Create order first to get the order ID => use the reference in the products
    let newOrder= await OrderRepo.create(orderData);
    if (!newOrder) {
        throw new Error("Order creation failed");
    }
    // Calculate total price
    newOrder.totalPrice = await calTotalPrice(newOrder.id as Types.ObjectId); // Calculate total price of the order
    // Apply voucher if provided after calculating total price
    if (orderData.voucher) newOrder.totalPrice = await handleApplyVoucher(newOrder, newOrder.voucher as Types.ObjectId); // Apply voucher if provided
    const updatedOrder = await OrderRepo.update(newOrder._id as Types.ObjectId, newOrder); // Update the order with total price and voucher
    return updatedOrder;
}
const handleGetOrders = async () => {
    // This function will retrieve all orders from the repository
    const orders = await OrderRepo.getAll();
    return orders;
}
const handleUpdateOrder = async (orderId: Types.ObjectId, orderData: OrderData) => {
    // This function will update an existing order by its ID
    const order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    // Update order fields with provided data
    const updatedOrder = OrderRepo.update(orderId, orderData);
    if (!updatedOrder) {
        throw new Error("Order update failed");
    }
    return updatedOrder;
}
const handleGetOrderById = async (orderId: Types.ObjectId) => {
    // This function will retrieve a specific order by its ID
    const order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
const handleApproveOrder = async (orderId: Types.ObjectId) => {
    // This function will approve an order by its ID
    let order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    order.status = order.status as OrderStatus; // Ensure order status is of type OrderStatus
    const nextStatus = await OrderStatusService.handleGetOrderStatusById(order.status.nextStatus as Types.ObjectId); // Get the next status for the order
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
// This function will apply a voucher to an order and mark it as used
const handleApplyVoucher = async (order: Order, voucherId: Types.ObjectId) => {
    const voucher = await VoucherService.handleGetVoucherById(voucherId); // Get voucher by code
    if (!voucher) {
        throw new Error("Voucher not found");
    }
    if (voucher.isActive === false) {
        throw new Error("Voucher is not active");
    }
    if (!voucher.discount){
        throw new Error("Voucher discount is required");
    }
    const check = await VoucherService.handleCheckApplyVoucher(voucher, order.totalPrice); // Check if voucher can be applied
    if (!check) {
        throw new Error("Voucher cannot be applied to this order");
    }
    await VoucherService.handleMarkVoucherAsUsed(voucher); // Apply voucher to order
    return order.totalPrice - voucher.discount;
}
// if the order status changes to packaging from pending, we need to update 
// the used loyalty points of the customer to update the customer level (if applicable)
const handleConfirmOrder = async (order: Order) => {
    // Check to update used loyalty points of customer
    let customer : Customer | null = null;
    order.customer = order.customer as Customer; // Ensure customer is of type Customer
    CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.INCREASE, 0, order.totalPrice ); // Update loyalty points of customer
    // if (order.customer.usedLoyalPoints && order.customer.usedLoyalPoints > 0) {
    //     const customerId = order.customer._id as Types.ObjectId; // Ensure customer ID is of type ObjectId
    //     order.customer.usedLoyalPoints += order.usedLoyalPoints ? order.usedLoyalPoints : 0; // Add used loyalty points to customer
    //     // Check if customer level needs to be updated based on new loyalty points
    //     const newCustomerLevel = await CustomerLevelService.handleGetByThreshold(order.customer.usedLoyalPoints) // Ensure levelId is of type CustomerLevel
    //     if (newCustomerLevel) {
    //         order.customer.levelId = newCustomerLevel; // Update customer level if applicable
    //     }
    //     customer = await CustomerService.handleUpdateCustomer(customerId, order.customer); // Update customer with new loyalty points and level
    // }
    // XỬ LÝ TRỪ HÀNG TỒN KHO
    for (const item of order.products) {
        item.product = item.product as Product; // Ensure item.product is of type Product
        ProductService.handleUpdateProductStock(item.product, item.quantity, UpdateType.DECREASE); // Decrease stock for each product in the order
    }
    
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
    if (order.status.status == OrderStatusName.PAID ) {
        throw new Error("Cannot cancel a paid order");
    }
    if ( order.status.status == OrderStatusName.DELIVERING) {
        throw new Error ("Cannot cancel a delivering order");
    }
    order.customer = order.customer as Customer; // Ensure customer is of type Customer
    // refund current loyalty points to customer
    CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.INCREASE, order.usedLoyalPoints, 0); // Refund loyalty points to customer
    // Case where the order is not pending, we need to refund loyalty points if used
    if (order.status.status !== OrderStatusName.PENDING) {
        CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.DECREASE, 0, order.totalPrice); // Refund loyalty points to customer
        // XỬ LÝ CỘNG HÀNG TỒN KHO
        for (const item of order.products) {
            item.product = item.product as Product; // Ensure item.product is of type Product
            ProductService.handleUpdateProductStock(item.product, item.quantity, UpdateType.INCREASE); // Decrease stock for each product in the order
        }
    }
    const restoredVoucher = order.voucher ? await VoucherService.handleRestoreVoucher(order.voucher as Types.ObjectId) : null; // Restore voucher if used
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
    handleApplyVoucher,
    handleUpdateOrder,
};