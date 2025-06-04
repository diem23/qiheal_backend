import { Types } from "mongoose"
import ProductRepo from "../repos/ProductRepo"
import Product from "../model/Product";
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
const handleGetProductsByListOfIds = async (productIds: Types.ObjectId[]) => {
    //const productIds = req.body.productIds;
    if (!Array.isArray(productIds) || productIds.length === 0) {
        throw new Error('Invalid product IDs');
    }
    for (const id of productIds) {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid product ID: ${id}`);
        }
    }

    const products = await Promise.all(productIds.map(async (id) => { 
        const productId = id as Types.ObjectId;
        const product = await ProductRepo.getById(productId);
        if (!product) {
            throw new Error(`Product not found for ID: ${id}`);
        }
        return product;
    }));
    return products;
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
const handleUpdateProduct = async (product: Product) => {
    if (Types.ObjectId.isValid(product._id) === false) {
        throw new Error('Invalid Product ID');
    }
    const productId = product._id as Types.ObjectId
   // console.log("productId: ", productId);
    const updatedProduct = await ProductRepo.update(productId, product)
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
    handleGetProductsByListOfIds,
    addBase64ImagesToProduct,
    handleGetProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
}
export default ProductService
