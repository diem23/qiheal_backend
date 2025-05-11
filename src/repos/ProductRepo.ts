import mongoose, { Types } from "mongoose"
import Product, { ProductModel } from "../model/Product"
const getAlls = async ():Promise<Product[] | null> => {
    const products = await ProductModel.find().lean<Product[]>().exec()
    
    return products
}
const getById = async (id: Types.ObjectId): Promise<Product|null> => {
    const product = await ProductModel.findById(id).lean().exec()
    return product
}

const create = async (
    product: Product,
    //accessTokenKey: string,
)  => {
    const newProduct = await ProductModel.create(product)
    return newProduct
}

const update = async (id: string, product: any) => {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true })
    return updatedProduct
}
const del = async (id: string) => {
    const deletedProduct = await ProductModel.findByIdAndDelete(id)
    return deletedProduct
}
const ProductRepo = {
    getAlls,
    getById,
    create,
    update,
    del,
}
export default ProductRepo