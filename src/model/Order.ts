import {model, Schema, Types} from "mongoose"
import Customer from "./Customer"
import Product from "./Product"
import OrderStatus from "./OrderStatus"

export default interface Order {
    _id?: Types.ObjectId
    customer?: Types.ObjectId | Customer
    products: {
        product: Types.ObjectId | Product
        quantity: number
    }[]
    usedLoyalPoints?: number // Optional, if the customer uses loyal points
    collaborator?: Types.ObjectId // Optional, if the order is handled by a collaborator
    totalPrice: number
    phone?: string // Optional, if the customer provides a phone number
    province?: string // Optional, if the order is shipped to a specific province
    district?: string // Optional, if the order is shipped to a specific district
    ward?: string // Optional, if the order is shipped to a specific ward
    address?: string // Optional, if the order is shipped to a specific address
    note?: string // Optional, if the customer adds a note to the order
    status: Types.ObjectId | OrderStatus // e.g., 'pending', 'completed', 'cancelled'
    isActive?: boolean
}
export const DOCUMENT_NAME = 'Orders'
export const COLLECTION_NAME = 'Orders'
const schema = new Schema<Order>({
    customer: {type: Schema.Types.ObjectId, ref: "Customers", required: false},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: "Products", required: true},
        quantity: {type: Schema.Types.Number, required: true, default: 1}
    }],
    usedLoyalPoints: {type: Schema.Types.Number, required: false, default: 0},
    collaborator: {type: Schema.Types.ObjectId, ref: "Collaborators", required: false},
    totalPrice: {type: Schema.Types.Number, required: true, default: 0},
    province: {type: Schema.Types.String, required: false},
    district: {type: Schema.Types.String, required: false},
    ward: {type: Schema.Types.String, required: false},
    address: {type: Schema.Types.String, required: false},
    note: {type: Schema.Types.String, required: false},
    status: {type: Schema.Types.ObjectId, ref: "OrderStatuses", required: true},
    isActive: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    timestamps: true,
})
export const OrderModel = model<Order>(DOCUMENT_NAME, schema, COLLECTION_NAME)