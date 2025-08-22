import {model, Schema, Types} from "mongoose"
export default interface Voucher {
    _id?: Types.ObjectId
    code?: string,
    discount?: number,
    isActive?: boolean,
    quantity?: number,
    remainingQuantity?: number,
    expiredDate?: Date,
    condition?: number
}
export const DOCUMENT_NAME = 'Vouchers'
export const COLLECTION_NAME = 'Vouchers'
const schema = new Schema<Voucher>({
    code: {type: Schema.Types.String, required: true, unique: true},
    discount: {type: Schema.Types.Number, required: true},
    isActive: {type: Schema.Types.Boolean, default: true},
    expiredDate: {type: Schema.Types.Date, required: true},
    remainingQuantity: {type: Schema.Types.Number, require: true},
    quantity: {type: Schema.Types.Number, default: 0},
    condition: {type: Schema.Types.Number, required: true},
}, {
    timestamps: true,
})
export const VoucherModel = model<Voucher>(DOCUMENT_NAME, schema, COLLECTION_NAME)