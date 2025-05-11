import { Types } from "mongoose"
import ProductRepo from "../repos/ProductRepo"

const handleGetProducts = async (req: any) => {
    const products = await ProductRepo.getAlls()
    //console.log(products)
    return products
}
const handleGetProductById = async (req: any) => {
    const productId =  Types.ObjectId.createFromHexString(req.params.id)
    //console.log("productId: ",productId);
    const product = await ProductRepo.getById(productId)
    //console.log(product);
    return product
}
const handleCreateProduct = async (req: any) => {
    const newProduct = await ProductRepo.create(req.body)
    return newProduct
}   
const handleUpdateProduct = async (req: any) => {
    const productId = Types.ObjectId.createFromHexString(req.params.id)
   // console.log("productId: ", productId);
    const updatedProduct = await ProductRepo.update(productId, req.body)
    return updatedProduct
}
const handleDeleteProduct = async (req: any) => {
    const productId = Types.ObjectId.createFromHexString(req.params.id)
    const deletedProduct = await ProductRepo.del(productId)
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
