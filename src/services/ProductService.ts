import { Types } from "mongoose"
import ProductRepo from "../repos/ProductRepo"
import Product from "../model/Product";
import { UpdateType } from "../Types/UpdateType.prop";

const handleSearch = async (req: any) => {
    const keyword = req.body.keyword;
    const page = parseInt(req.body.page) || 1
    const limit = parseInt(req.body.limit) || 10
    const products = await ProductRepo.search(keyword, page, limit)
    return products
}
const handleGetProducts = async (req: any) => {
    const products = await ProductRepo.getAlls()
    return products
}
const handleGetProductsByListOfIds = async (productIds: Types.ObjectId[]) => {
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
    const product = await ProductRepo.getById(productId)
    return product
}
const handleCreateProduct = async (product: Product) => {
    const newProduct = await ProductRepo.create(product)
    return newProduct
}   
const handleUpdateProduct = async (product: Product, productId: Types.ObjectId) => {

    const updatedProduct = await ProductRepo.update(productId, product)
    return updatedProduct
}
const handleUpdateProductStock = async (product: Product, quantity: number, updateType: UpdateType = UpdateType.SET) => {
    if (!product.stockQty) product.stockQty = 0;

    
    switch (updateType) {
        case UpdateType.INCREASE:
            product.stockQty += quantity;
            break;
        case UpdateType.DECREASE:
            product.stockQty -= quantity;
            break;
        case UpdateType.SET:
            product.stockQty = quantity;
            break;
        default:
            throw new Error('Invalid update type');
    }
    const tempProduct: Product = {
        stockQty: product.stockQty
    }
    const updatedProduct = await ProductRepo.update(product._id as Types.ObjectId, tempProduct); 
    return updatedProduct;
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
const handleChooseRelatedProducts = async (productId: Types.ObjectId, relatedProductIds: Types.ObjectId[]) => {
    const product = ProductRepo.chooseRelatedProducts(productId, relatedProductIds)
    return product;
}
const ProductService = {
    handleSearch,
    handleUpdateProductStock,
    handleGetProductsByListOfIds,
    addBase64ImagesToProduct,
    handleGetProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleChooseRelatedProducts
}
export default ProductService
