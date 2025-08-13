import { Types } from "mongoose";
import { OrderData } from "../Types/Order.props";
import { OrderRepo } from "../repos/OrderRepo";
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
import { CustomerRepo } from "../repos/CustomerRepo";
import { MailInfoProps } from "../Types/MailInfo.props";
import sendMail from "../helper/sendMail";
const calTotalPrice = async (orderId: Types.ObjectId) => {
    const order = await OrderRepo.getById(orderId); // Retrieve the order by ID
    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }
    let totalPrice = order.products.reduce((total, item) => {
        item.product = item.product as Product; // Ensure item.product is of type Product
        return total + (item.product.actualPrice ? item.product.actualPrice : 0) * item.quantity;
    }, 0);
    let reducedMoney = order.usedLoyalPoints ? await SystemSettingsService.pointAndMoneyConversion(ConversionType.POINT_TO_MONEY, 0, order.usedLoyalPoints) : 0; // Convert loyalty points to money if used
    totalPrice -= reducedMoney; // Deduct used loyalty points if any
    console.log("order.usedLoyalPoints: ", order.usedLoyalPoints, "reducedMoney: ", reducedMoney, "totalPrice: ", totalPrice);
    if (order.customer) {
        order.customer = order.customer as Customer;
        if (order.customer.levelId) {
            order.customer.levelId = order.customer.levelId as CustomerLevel; // Ensure levelId is of type with discount
            totalPrice -= totalPrice * order.customer.levelId.discountPercent; // Apply customer level discount if any
        }
    }
    if (totalPrice < 0) totalPrice = 0; // Ensure total price is not negative
    return totalPrice;
}
const handleSendMailAfterOrder = async (to: string, subject: string, emailInfo: MailInfoProps) => {
    const html = `
<!DOCTYPE html>
<html lang="vi" style="margin:0;padding:0;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Thông báo đơn hàng mới</title>
  <style>
    table, td { border-collapse: collapse !important; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
    a { text-decoration: none; }
    @media screen and (max-width:600px){
      .container { width: 100% !important; }
      .px-24 { padding-left:16px !important; padding-right:16px !important; }
      .py-24 { padding-top:16px !important; padding-bottom:16px !important; }
      .stack { display:block !important; width:100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;">
  <div style="display:none;opacity:0;visibility:hidden;mso-hide:all;max-height:0;max-width:0;overflow:hidden;">
    Đơn hàng mới từ ${emailInfo.fullname} – Tổng tiền ${emailInfo.totalPrice}
  </div>

  <table role="presentation" width="100%" bgcolor="#f6f7fb" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" class="container" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(20,20,43,.06);">
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:28px 24px;">
              <div style="font:700 18px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#ffffff;letter-spacing:.3px;">
                THÔNG BÁO ĐƠN HÀNG MỚI
              </div>
              <div style="font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#e9f6ff;margin-top:6px;">
                Mã đơn: <span style="font-weight:700;color:#fff;">${emailInfo.orderCode}</span>
              </div>
            </td>
          </tr>

          <tr>
            <td class="px-24 py-24" style="padding:24px 24px 8px 24px;">
              <div style="font:600 18px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#111827;">
                Có đơn hàng mới từ ${emailInfo.fullname}
              </div>
              <div style="font:400 14px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#4b5563;margin-top:6px;">
                Vui lòng kiểm tra chi tiết bên dưới và xử lý đơn trên hệ thống quản trị.
              </div>
            </td>
          </tr>

          <tr>
            <td class="px-24" style="padding:0 24px 8px 24px;">
              <table role="presentation" width="100%" style="border:1px solid #eef2f7;border-radius:12px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#f9fafb;padding:14px 16px;font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#111827;">
                    Thông tin đơn hàng
                  </td>
                </tr>
                <tr>
                  <td width="38%" style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Họ và tên</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.fullname}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Tổng tiền</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;font-weight:700;color:#111827;">${emailInfo.totalPrice}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Số điện thoại</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.phone}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Email</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;"><a href="mailto:${emailInfo.email}" style="color:#4f46e5;">${emailInfo.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Tỉnh/Thành phố</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.province}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Quận/Huyện</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.district}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Phường/Xã</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.ward}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#374151;">Địa chỉ chi tiết</td>
                  <td style="padding:12px 16px;border-top:1px solid #eef2f7;color:#111827;">${emailInfo.address}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" class="py-24" style="padding:20px 24px 24px 24px;">
              <a href="${emailInfo.orderUrl}" target="_blank"
                 style="display:inline-block;background:#4f46e5;color:#ffffff;font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;padding:12px 18px;border-radius:10px;">
                Mở đơn hàng trong Admin
              </a>
              <div style="font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#6b7280;margin-top:10px;">
                Nếu nút không hiển thị, truy cập: ${emailInfo.orderUrl}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 24px 24px 24px;border-top:1px solid #eef2f7;">
              <table role="presentation" width="100%">
                <tr>
                  <td class="stack" style="font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#6b7280;">
                    Email này được gửi tự động từ hệ thống. Vui lòng không trả lời trực tiếp.
                  </td>
                 
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <div style="height:24px;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`
await sendMail(to, subject, html);
}
const handleCreateOrder = async (orderData: Order ) => {
    // This function will handle the creation of a new order
    // It should validate the order data and then call the repository to create the order
    let customer: Customer | null = null;
    customer = await CustomerRepo.findById(orderData.customer as Types.ObjectId);
    if (!orderData.phone){
        if (!customer) {
            throw new Error("Cần có mã đơn hàng hoặc số điện thoại để tạo đơn hàng");
        }
        orderData.phone = customer.phone as string; // Use customer's phone if not provided
    }
    // Check to minus current loyalty points of customer
    if (customer){
        CustomerLevelService.handleUpdateLoyaltyPoints(customer, UpdateType.DECREASE, orderData.usedLoyalPoints , 0); // Update loyalty points of customer

    }

    
    

    const firstStatus = await OrderStatusService.handleGetfirstStatus(); // Get the first status for the order
    orderData.status = firstStatus._id; // Set the order status to the first status
    console.log("orderData: ", orderData);
    //Create order first to get the order ID => use the reference in the products
    let newOrder= await OrderRepo.create(orderData);
    if (!newOrder) {
        throw new Error("Tạo đơn hàng thất bại");
    }
    try{
        // Calculate total price
        newOrder.totalPrice = await calTotalPrice(newOrder.id as Types.ObjectId); // Calculate total price of the order
        console.log("newOrder1.totalPrice: ", newOrder?.totalPrice);
        if (newOrder.totalPrice < 300000) newOrder.totalPrice += 20000; // Add shipping fee if total price is less than 300000
        console.log("newOrder2.totalPrice: ", newOrder?.totalPrice);
        // Apply voucher if provided after calculating total price
        if (orderData.voucher) newOrder.totalPrice = await handleApplyVoucher(newOrder, newOrder.voucher as Types.ObjectId); // Apply voucher if provided
        const updatedOrder = await OrderRepo.update(newOrder._id as Types.ObjectId, newOrder); // Update the order with total price and voucher
        console.log("updatedOrder.totalPrice: ", updatedOrder?.totalPrice);
        return updatedOrder;
    }
    catch (error) {
        // If there is an error, we need to cancel the order and refund loyalty points
        if (customer) {
            CustomerLevelService.handleUpdateLoyaltyPoints(customer, UpdateType.INCREASE, orderData.usedLoyalPoints, 0); // Refund loyalty points to customer
        }
        await OrderRepo.del(newOrder._id as Types.ObjectId); // Delete the order if creation failed
        throw error; // Re-throw the error to be handled by the caller
    }
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
        throw new Error("Không tìm thấy đơn hàng");
    }
    // Update order fields with provided data
    const updatedOrder = OrderRepo.update(orderId, orderData);
    if (!updatedOrder) {
        throw new Error("Cập nhật đơn hàng thất bại");
    }
    return updatedOrder;
}
const handleGetOrderById = async (orderId: Types.ObjectId) => {
    // This function will retrieve a specific order by its ID
    const order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }
    return order;
}
const handleGetOrdersByCustomerId = async (customerId: Types.ObjectId) => {
    // This function will retrieve all orders for a specific customer by their ID
    const orders = await OrderRepo.getByCustomerId(customerId);
    if (!orders || orders.length === 0) {
        throw new Error("Không tìm thấy đơn hàng cho khách hàng này");
    }
    return orders;
}
const handleApproveOrder = async (orderId: Types.ObjectId) => {
    // This function will approve an order by its ID
    let order = await OrderRepo.getById(orderId);
    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }
    order.status = order.status as OrderStatus; // Ensure order status is of type OrderStatus
    const nextStatus = await OrderStatusService.handleGetOrderStatusById(order.status.nextStatus as Types.ObjectId); // Get the next status for the order
    if (!nextStatus) {
        throw new Error("Không tìm thấy trạng thái đơn hàng tiếp theo");
    }
    if (nextStatus?.status == OrderStatusName.PACKAGING ) {
        await handleConfirmOrder(order); // Handle confirm order if status is packaging
    }
    order.status = nextStatus; // Update order status to the next status
    const updatedOrder = await OrderRepo.update(orderId, order); // Update the order in the repository  
    if (!updatedOrder) {
        throw new Error("Cập nhật đơn hàng thất bại");
    }
    return updatedOrder;
}
// This function will apply a voucher to an order and mark it as used
const handleApplyVoucher = async (order: Order, voucherId: Types.ObjectId) => {
    const voucher = await VoucherService.handleGetVoucherById(voucherId); // Get voucher by code
    if (!voucher) {
        throw new Error("Không tìm thấy voucher");
    }
    if (voucher.isActive === false) {
        throw new Error("Voucher không hoạt động");
    }
    if (!voucher.discount){
        throw new Error("Cần có giá trị giảm giá cho voucher");
    }
    const check = await VoucherService.handleCheckApplyVoucher(voucher, order.totalPrice); // Check if voucher can be applied
    if (!check) {
        throw new Error("Voucher không thể áp dụng cho đơn hàng này");
    }
    await VoucherService.handleMarkVoucherAsUsed(voucher); // Apply voucher to order
    return order.totalPrice - voucher.discount;
}
// if the order status changes to packaging from pending, we need to update 
// the used loyalty points of the customer to update the customer level (if applicable)
const handleConfirmOrder = async (order: Order) => {
    // Check to update used loyalty points of customer
    let customer : Customer | null = null;
    if (order.customer) {
        order.customer = order.customer as Customer; // Ensure customer is of type Customer
        CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.INCREASE, 0, order.totalPrice ); // Update loyalty points of customer
    }
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
        throw new Error("Không tìm thấy đơn hàng");
    }
    order.status = order.status as OrderStatus; // Ensure order status is of type OrderStatus
    if (order.status.status == OrderStatusName.PAID ) {
        throw new Error("Không thể hủy đơn hàng đã thanh toán");
    }
    if ( order.status.status == OrderStatusName.DELIVERING) {
        throw new Error ("Không thể hủy đơn hàng đang giao");
    }
    if (order.customer){
        order.customer = order.customer as Customer; // Ensure customer is of type Customer
        // refund current loyalty points to customer
        CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.INCREASE, order.usedLoyalPoints, 0); // Refund loyalty points to customer
    }
    // Case where the order is not pending, we need to refund loyalty points if used
    if (order.status.status !== OrderStatusName.PENDING) {
        if (order.customer) CustomerLevelService.handleUpdateLoyaltyPoints(order.customer, UpdateType.DECREASE, 0, order.totalPrice); // Refund loyalty points to customer
        // XỬ LÝ CỘNG HÀNG TỒN KHO
        for (const item of order.products) {
            item.product = item.product as Product; // Ensure item.product is of type Product
            ProductService.handleUpdateProductStock(item.product, item.quantity, UpdateType.INCREASE); // Decrease stock for each product in the order
        }
    }
    const restoredVoucher = order.voucher ? await VoucherService.handleRestoreVoucher(order.voucher as Types.ObjectId) : null; // Restore voucher if used
    const cancelledStatus = await OrderStatusRepo.getStatusByName(OrderStatusName.CANCELLED); // Get the cancelled status
    if (!cancelledStatus) {
        throw new Error("Không tìm thấy trạng thái huỷ cho đơn hàng");
    }
    order.status = cancelledStatus; // Update order status to cancelled
    const updatedOrder = await OrderRepo.update(orderId, order); // Update the order in the repository
    return updatedOrder;
}
const handleDeleteOrder = async (orderId: Types.ObjectId) => {
    // This function will delete an order by its ID
    const deletedOrder = await OrderRepo.del(orderId);
    if (!deletedOrder) {
        throw new Error("Xóa đơn hàng thất bại");
    }
    return deletedOrder;
}
export const OrderService = {
    handleSendMailAfterOrder,
    handleCreateOrder,
    handleGetOrdersByCustomerId,
    handleGetOrders,
    handleGetOrderById,
    handleApproveOrder,
    handleCancelOrder,
    calTotalPrice,
    handleDeleteOrder,
    handleApplyVoucher,
    handleUpdateOrder,
};