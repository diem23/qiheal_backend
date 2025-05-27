import { Types } from "mongoose";
import Cart, { CartModel } from "../model/Cart";
import { CustomerLevelModel } from "../model/CustomerLevel";
const getAll = async () => {
    const carts = await CartModel.find().populate("customer");
    return carts;
}
const getById = async (id: Types.ObjectId) => {
    const cart = await CartModel.findById(id).populate("customer").populate("products.product").exec();
    return cart;
}
const create = async (Cart: Cart) => {
    const newCart = await CartModel.create(Cart);
    return newCart;
}
const update = async (id: Types.ObjectId, Cart: Cart) => {
    const updatedCart = await CartModel.findByIdAndUpdate(id, Cart, { new: true }).populate("customer").populate("items.product");
    return updatedCart;
}
const del = async (id: Types.ObjectId) => {
    const deletedCart = await CartModel.findByIdAndDelete(id);
    return deletedCart;
}
const getByCustomerId = async (customerId: Types.ObjectId) => {
    const cart = await CartModel.findOne({ customer: customerId }).populate("customer").populate("items.product");
    return cart;
}

export const CartRepo = {
    getAll,
    getById,
    create,
    update,
    del,
    getByCustomerId,
    
};


