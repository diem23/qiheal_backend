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
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<Product[]>()
        .exec()

    return products
}
const getAlls = async ():Promise<Product[] | null> => {
    // get products ordered by createdAt in descending order
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean<Product[]>().exec()
    //const products = await ProductModel.find().lean<Product[]>().exec()
    
    return products
}
const getById = async (id: Types.ObjectId): Promise<Product|null> => {
    const product = await ProductModel.findById(id).lean().exec()
    return product
}

const create = async (
    product: Product,
)  => {
    try{
    if (!product.actualPrice) product.actualPrice = product.price;
    const newProduct = await ProductModel.create(product)
    return newProduct
} catch (error) {
    throw new Error("Failed to create product");

}
}

const update = async (id: Types.ObjectId, product: any) => {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true }).exec()
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
const chooseRelatedProducts = async (productId: Types.ObjectId, relatedProductIds: Types.ObjectId[]) => {
    let currentProduct = await ProductModel.findById(productId).exec()
    if (!currentProduct) {
        throw new Error("Product not found")
    }
    currentProduct.relatedProduct = relatedProductIds
    
    await currentProduct.save();
    return currentProduct;
}
const ProductRepo = {
    search,
    getAlls,
    getById,
    create,
    update,
    del,
    updateImages,
    chooseRelatedProducts
}
export default ProductRepo