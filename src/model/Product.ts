import {model, Schema, Types} from "mongoose"
export default interface Product{
    _id: Types.ObjectId;
    name?: string;
    desc?: string;
    price?: number;
    stockQty?: number;
    warningLevel?: number;
    categoryId: Types.ObjectId;
}
export const DOCUMENT_NAME = 'Products';
export const COLLECTION_NAME = 'Products';
const schema = new Schema<Product>({
    name: {type: Schema.Types.String, required: true},
    desc: {type: Schema.Types.String, required: true},
    price: {type: Schema.Types.Number, required: true},
    stockQty: {type: Schema.Types.Number, required: true},
    warningLevel: {type: Schema.Types.Number, required: true},
    categoryId: {type: Schema.Types.ObjectId, ref: "Category"},
}, {
    timestamps: true,
})
export const ProductModel = model<Product>( DOCUMENT_NAME,schema, COLLECTION_NAME)
