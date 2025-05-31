import {model, Schema, Types} from "mongoose"
export enum OrderStatusName {
    PENDING = 'pending',
    PACKAGING = 'packaging',
    DELIVERING = 'delivering',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}
export default interface OrderStatus {
    _id?: Types.ObjectId
    status?: OrderStatusName
    nextStatus?: Types.ObjectId | OrderStatus  // Optional, if the status can transition to another status
    isActive?: boolean
    isFirstStatus?: boolean // Optional, to indicate if this is the first status in the workflow
}
export const DOCUMENT_NAME = 'OrderStatuses'
export const COLLECTION_NAME = 'OrderStatuses'
const schema = new Schema<OrderStatus>({
    status: {
        type: String,
        enum: Object.values(OrderStatusName),
        required: true
    },
    nextStatus: {type: Schema.Types.ObjectId, ref: "OrderStatuses", required: false},
    isActive: {type: Schema.Types.Boolean, required: true, default: true},
    isFirstStatus: {type: Schema.Types.Boolean, required: false, default: false}    
}, {
    timestamps: true,
})
export const OrderStatusModel = model<OrderStatus>(DOCUMENT_NAME, schema, COLLECTION_NAME)
