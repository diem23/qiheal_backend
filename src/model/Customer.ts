import {model, Schema, Types} from "mongoose"
import CustomerLevel from "./CustomerLevel"
import User from "./User"

export default interface Customer {
    _id?: Types.ObjectId
    fullname?: string
    phone?: string
    email?: string
    user?: Types.ObjectId | User
    usedLoyalPoints?: number
    currentLoyalPoints?: number
    levelId?: Types.ObjectId | CustomerLevel
    cartId?: Types.ObjectId
    isActive?: boolean
}
export const DOCUMENT_NAME = 'Customers'
export const COLLECTION_NAME = 'Customers'
const schema = new Schema<Customer>({
    phone: {type: Schema.Types.String, required: true, unique: true}, 
    fullname: {type: Schema.Types.String, required: false},
    email: {type: Schema.Types.String, required: false, unique: true},
    user: {type: Schema.Types.ObjectId, ref: "Users"},
    usedLoyalPoints: {type: Schema.Types.Number, required: true, default: 0},
    currentLoyalPoints: {type: Schema.Types.Number, required: true, default: 0},
    levelId: {type: Schema.Types.ObjectId, ref: "CustomerLevels"},
    cartId: {type: Schema.Types.ObjectId, ref: "Carts"},
    isActive: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    timestamps: true,
})
export const CustomerModel = model<Customer>(DOCUMENT_NAME, schema, COLLECTION_NAME)