import mongoose, { Types } from "mongoose"
import {v2 as cloudinary} from "cloudinary"
import Product, { ProductModel } from "../model/Product"

const search = async (keyword: string, page: number, limit: number): Promise<Product[] | null> => {
    const products = await ProductModel.find({
        $or: [
            { name: { $regex: '%' + keyword + '%', $options: "i" } },
            { desc: { $regex: keyword, $options: "i" } }
        ]
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<Product[]>()
        .exec()

    return products
}
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
    try{
    if (!product.actualPrice) product.actualPrice = product.price;
    const newProduct = await ProductModel.create(product)
    return newProduct
} catch (error) {
    throw new Error("Failed to create product");

}
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
const updateImages = async (id: Types.ObjectId, files: string[]) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    let images: string[] = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        //console.log("file: ", file);
        if (!file) {
            console.log("No file found");
            continue;
        }
        const uploadResult = await cloudinary.uploader.upload(file);
        images.push(uploadResult.public_id);
    }
    
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $push: { images: { $each: images } } }, // Add new Base64 images to the array
        { new: true }
    ).exec();

    return updatedProduct;
};
const ProductRepo = {
    search,
    getAlls,
    getById,
    create,
    update,
    del,
    updateImages
}
export default ProductRepo