import { Types } from "mongoose"
import ProductRepo from "../repos/ProductRepo"

const handleGetProducts = async (req: any) => {
    const products = await ProductRepo.getAlls()
    console.log(products)
    return products
}
const handleGetProductById = async (req: any) => {
    const productId =  Types.ObjectId.createFromHexString(req.params.id)
    console.log("productId: ",productId);
    const product = await ProductRepo.getById(productId)
    console.log(product);
    return product
}
const handleCreateProduct = async (req: any) => {
    const newProduct = await ProductRepo.create(req.body)
    return newProduct
}
const handleUpdateProduct = async (req: any) => {
    const updatedProduct = await ProductRepo.update(req.id, req.body)
    return updatedProduct
}
const handleDeleteProduct = async (req: any) => {
    const deletedProduct = await ProductRepo.del(req.id)
    return deletedProduct
}
const ProductService = {
    handleGetProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
}
export default ProductService
