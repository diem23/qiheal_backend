import { Types } from "mongoose"
import ProductRepo from "../repos/ProductRepo"
const handleSearch = async (req: any) => {
    const keyword = req.body.keyword;
    const page = parseInt(req.body.page) || 1
    const limit = parseInt(req.body.limit) || 10
    //console.log("keyword: ", keyword);
    //console.log("page: ", page);
    //console.log("limit: ", limit);
    const products = await ProductRepo.search(keyword, page, limit)
    return products
}
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
   
    //console.log("filesBase64: ", filesBase64);
    console.log("req.body: ", req.body?.body);
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
    const files = req.files?.files;
    const filesArray = Array.isArray(files) ? files : [files];
    const filteredFiles = filesArray.filter((file: any) => typeof file === 'object' && file !== null);
    const filesBase64: string [] = filteredFiles.map((file: any) => 'data:image/jpeg;base64,' + file?.data.toString('base64'));
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid Product ID');
    }

    const updatedProduct = await ProductRepo.updateImages(
        new Types.ObjectId(productId),
        filesBase64
    );

    return updatedProduct;
};
const ProductService = {
    handleSearch,
    addBase64ImagesToProduct,
    handleGetProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
}
export default ProductService
