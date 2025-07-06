import { Types } from "mongoose";
import Voucher, { VoucherModel } from "../model/Voucher";

const getAlls = async (): Promise<Voucher[] | null> => {
    const vouchers = await VoucherModel.find().sort({createdAt: -1}).lean<Voucher[]>().exec();
    return vouchers;
}
const getById = async (id: Types.ObjectId): Promise<Voucher | null> => {
    const voucher = await VoucherModel.findById(id).lean().exec();
    return voucher;
}
const getByCode = async (code: string): Promise<Voucher | null> => {
    const voucher = await VoucherModel.findOne({ code }).lean().exec();
    return voucher;
}
const create = async (voucher: Voucher) => {
    try {
        const newVoucher = await VoucherModel.create(voucher);
        return newVoucher;
    } catch (error) {
        throw new Error("Failed to create voucher");
    }
}
const update = async (id: Types.ObjectId, voucher: any) => {
    const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, voucher, { new: true }).exec();
    return updatedVoucher;
}
const del = async (id: Types.ObjectId) => {
    const deletedVoucher = await VoucherModel.findByIdAndDelete(id);
    return deletedVoucher;
}
export default {
    getAlls,
    getByCode,
    getById,
    create,
    update,
    del
}