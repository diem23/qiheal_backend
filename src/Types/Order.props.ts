import { Types } from "mongoose"
import Product from "../model/Product"

export type OrderData = {
    customerId: Types.ObjectId | string,
    collaboratorId?: Types.ObjectId | string,
    phone: string,
    usedLoyalPoints: number,
    products: {
            product: Types.ObjectId | Product,
            quantity: number
        }[],
    province?: string,
    district?: string,
    ward?: string,
    address?: string,
    note?: string,
}