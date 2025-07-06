import { Types } from "mongoose";
import Cart from "../model/Cart";
import { CartRepo } from "../repos/CartRepo";
import { CartModel } from "../model/Cart";
import Product from "../model/Product";
const calTotalPrice = async (cartId: Types.ObjectId) => {
    const cart = await handleGetCartById(cartId);
    //const cart = await CartModel.findById(cartId).populate('products').exec();
    if (!cart) {
        throw new Error("Cart not found");
    }
    let totalPrice = cart.products.reduce((total, item) => {
        item.product = item.product as Product; // Ensure item.product is of type Product
        return total + (((item.product.actualPrice)? item.product.actualPrice: 0) * item.quantity);
    }, 0);
    cart.totalPrice = totalPrice;
    const newCart = await CartRepo.update(cartId, cart); // Update the cart with the new total price
    return newCart
}
const handleGetCarts = async () => {
    // Here you would typically call your CartRepo.getAll method
    // For example:
    const carts = await CartRepo.getAll();
    return carts;
}
const handleUpdateCart = async (cartId: Types.ObjectId, cart: Cart) => {
    const existingCart = await handleGetCartById(cartId);
    if (!existingCart) {
        throw new Error("Cart not found");
    }
    existingCart.products = cart.products;
    let updatedCart = await CartRepo.update(cartId, existingCart)
    updatedCart = await calTotalPrice(cartId);
    
    // Simulating the update operation
    return updatedCart;
}
const handleCreateCart = async (cart: Cart) => {
    // Here you would typically call your CartRepo.create method
    // For example:
    // const newCart = await CartRepo.create(cart);
    
    // Simulating the create operation
    const newCart = CartRepo.create(cart)
    if (!newCart) {
        throw new Error("Cart creation failed");
    }
    return newCart;
}
const handleGetCartById = async (cartId: Types.ObjectId) => {
    // Here you would typically call your CartRepo.getById method
    // For example:
    // const cart = await CartRepo.getById(cartId);
    
    // Simulating the get operation
    const cart = await CartRepo.getById(cartId)
    if (!cart) {
        throw new Error("Cart not found");
    }
    return cart;
}
const handleGetCartByCustomerId = async (customerId: Types.ObjectId) => {
    // Here you would typically call your CartRepo.getByCustomerId method
    // For example:
    // const cart = await CartRepo.getByCustomerId(customerId);
    
    // Simulating the get operation
    const cart = CartRepo.getByCustomerId(customerId)
    if (!cart) {
        throw new Error("Cart not found for this customer");
    }
    return cart;
}
const handleDeleteCart = async (cartId: Types.ObjectId) => {
    // Here you would typically call your CartRepo.del method
    // For example:
    // const deletedCart = await CartRepo.del(cartId);
    
    // Simulating the delete operation
    if (!Types.ObjectId.isValid(cartId)) {
        throw new Error("Invalid Cart ID");
    }
    const curCart = handleGetCartById(cartId); // Ensure the cart exists before deleting
    if (!curCart) {
        throw new Error("Cart not found");
    }
    const deletedCart = CartRepo.del(cartId)
    if (!deletedCart) {
        throw new Error("Cart deletion failed");
    }
    return deletedCart;
}
export const CartService = {
    handleGetCarts,
    handleUpdateCart,
    handleCreateCart,
    calTotalPrice,
    handleGetCartById,
    handleGetCartByCustomerId,
    handleDeleteCart
};
