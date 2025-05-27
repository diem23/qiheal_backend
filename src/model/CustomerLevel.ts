import {model, Schema, Types} from "mongoose"
export default interface CustomerLevel{
    _id: Types.ObjectId
    code: string
    discountPercent: number
    threshold?: number
    isActive?: boolean

}

export const DOCUMENT_NAME = 'CustomerLevels'
export const COLLECTION_NAME = 'CustomerLevels'
const schema = new Schema<CustomerLevel>({
    code: {type: Schema.Types.String, required: true},
    discountPercent: {type: Schema.Types.Number, required: true},
    threshold: {type: Schema.Types.Number, required: true},
    isActive: {type: Schema.Types.Boolean, required: true, default: true}
}, {
    timestamps: true,
})
export const CustomerLevelModel = model<CustomerLevel>(DOCUMENT_NAME, schema, COLLECTION_NAME)