import { Types } from "mongoose";
import VoucherRepo from "../repos/VoucherRepo";
import Voucher from "../model/Voucher";

const handleGetAllVouchers = async () => {
    const vouchers = await VoucherRepo.getAlls();
    return vouchers;
}
const handleGetVoucherById = async (voucherId: Types.ObjectId) => {
    const voucher = await VoucherRepo.getById(voucherId);
    return voucher;
}
const handleCreateVoucher = async (voucher: Voucher) => {
    const newVoucher = await VoucherRepo.create(voucher);
    if (!newVoucher) {
        throw new Error("Tạo voucher thất bại");
    }
    return newVoucher;
}
const handleUpdateVoucher = async (voucherId: Types.ObjectId, voucher: Voucher) => {
    const updatedVoucher = await VoucherRepo.update(voucherId, voucher);
    if (!updatedVoucher) {
        throw new Error("Cập nhật voucher thất bại");
    }
    return updatedVoucher;
}
const handleDeleteVoucher = async (voucherId: Types.ObjectId) => {
    const deletedVoucher = await VoucherRepo.del(voucherId);
    if (!deletedVoucher) {
        throw new Error("Xóa voucher thất bại");
    }
    return deletedVoucher;
}
const handleGetVoucherByCode = async (code: string) => {
    const voucher = await VoucherRepo.getByCode(code);
    if (!voucher) {
        throw new Error("Không tìm thấy voucher");
    }
    return voucher;
}
const handleCheckApplyVoucher = async (voucher: Voucher, totalPrice: number): Promise<boolean> => {
    // This function can be implemented to apply a voucher to a user's cart or order
    // For now, we will just return the voucher details
    if (!voucher) {
        throw new Error("Không tìm thấy voucher");
    }
    if (typeof voucher.condition != 'number' ) {
        throw new Error("Điều kiện voucher không hợp lệ");
    }
    if (typeof voucher.discount != 'number' ) {
        throw new Error("Giảm giá voucher không hợp lệ");
    }
    if ( !voucher.expiredDate) {
        throw new Error("Ngày hết hạn voucher là bắt buộc");
    }
    return (voucher.condition <= totalPrice && voucher.expiredDate > new Date());

}
const handleRestoreVoucher = async (voucher: Voucher) => {
    // This function can be implemented to restore a voucher if needed
    voucher.isActive = true;
    const restoredVoucher = await VoucherRepo.update(voucher._id as Types.ObjectId, voucher);   
    if (!restoredVoucher) {
        throw new Error("Khôi phục voucher thất bại");
    }
    return restoredVoucher;
}
const handleMarkVoucherAsUsed = async (voucher: Voucher) => {
    // This function can be implemented to mark a voucher as used
    voucher.isActive = false;
    const updatedVoucher = await VoucherRepo.update(voucher._id as Types.ObjectId, voucher);
    if (!updatedVoucher) {
        throw new Error("Đánh dấu voucher là đã sử dụng thất bại");
    }
    return updatedVoucher;
}

const VoucherService = {
    handleGetAllVouchers,
    handleGetVoucherById,
    handleCreateVoucher,
    handleUpdateVoucher,   
    handleCheckApplyVoucher, 
    handleDeleteVoucher,
    handleGetVoucherByCode,
    handleRestoreVoucher,
    handleMarkVoucherAsUsed
};
export default VoucherService;