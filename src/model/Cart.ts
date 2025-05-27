import {model, Schema, Types} from "mongoose"
import Product, { ProductModel } from "./Product"
export default interface Cart {
    _id?: Types.ObjectId
    customer: Types.ObjectId
    products: {
        product: Types.ObjectId
        quantity: number
    }[]
    totalPrice: number
    isActive?: boolean
}
export const DOCUMENT_NAME = 'Carts'
export const COLLECTION_NAME = 'Carts'
const schema = new Schema<Cart>({
    customer: {type: Schema.Types.ObjectId, ref: "Customers", required: true},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: "Products", required: true},
        quantity: {type: Schema.Types.Number, required: true, default: 1}
    }],
    totalPrice: {type: Schema.Types.Number, required: true, default: 0},
    isActive: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    timestamps: true,
})
export const CartModel = model<Cart>(DOCUMENT_NAME, schema, COLLECTION_NAME)