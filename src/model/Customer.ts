import {model, Schema, Types} from "mongoose"

export default interface Customer {
    _id?: Types.ObjectId
    phone?: string
    email?: string
    user?: Types.ObjectId
    loyalPoints?: number
    levelId?: Types.ObjectId
    isActive?: boolean
}
export const DOCUMENT_NAME = 'Customers'
export const COLLECTION_NAME = 'Customers'
const schema = new Schema<Customer>({
    phone: {type: Schema.Types.String, required: true},
    email: {type: Schema.Types.String, required: false},
    user: {type: Schema.Types.ObjectId, ref: "Users"},
    loyalPoints: {type: Schema.Types.Number, required: true, default: 0},
    levelId: {type: Schema.Types.ObjectId, ref: "CustomerLevels"},
    isActive: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    timestamps: true,
})
export const CustomerModel = model<Customer>(DOCUMENT_NAME, schema, COLLECTION_NAME)