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
const addBase64ImagesToProduct = async (req: any) => {
    const productId: string = req.params.id;
    const base64Images = req.body.images; // Expecting an array of Base64 strings
    //console.log("base64Images: ", base64Images);
    //console.log("productId: ", productId);
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid Product ID');
    }

    const updatedProduct = await ProductRepo.updateImages(
        new Types.ObjectId(productId),
        base64Images
    );

    return updatedProduct;
};
const ProductService = {
    addBase64ImagesToProduct,
    handleGetProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
}
export default ProductService
