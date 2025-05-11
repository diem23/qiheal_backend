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
    //console.log("product: ", product);
    const newProduct = await ProductModel.create(product)
    return newProduct
}

const update = async (id: Types.ObjectId, product: any) => {
    //console.log("product: ", product);
    //console.log("id: ", id);
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true }).exec()
    //console.log("updatedProduct: ", updatedProduct);
    return updatedProduct
}
const del = async (id: Types.ObjectId) => {
    const deletedProduct = await ProductModel.findByIdAndDelete(id)
    return deletedProduct
}
const updateImages = async (id: mongoose.Types.ObjectId, base64Images: string[]) => {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $push: { images: { $each: base64Images } } }, // Add new Base64 images to the array
        { new: true }
    ).exec();

    return updatedProduct;
};
const ProductRepo = {
    getAlls,
    getById,
    create,
    update,
    del,
    updateImages
}
export default ProductRepo