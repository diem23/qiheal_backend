import express from 'express';
import VoucherService from '../services/VoucherService';
import { Types } from 'mongoose';
import { UserRole } from '../model/User';
import verifyRoles from '../middleware/verifyRoles';
export const VoucherRouter = express.Router();
VoucherRouter.get('/',   async (req, res) => {
    try {
        const vouchers = await VoucherService.handleGetAllVouchers();
        res.status(200).json({
            message: 'Get all vouchers successfully',
            count: vouchers?.length,
            data: vouchers,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
VoucherRouter.get('/:id',   async (req, res) => {
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({ message: 'Invalid voucher ID format' });
        }
        const voucherId = new Types.ObjectId(req.params.id);
        const voucher = await VoucherService.handleGetVoucherById(voucherId);
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.status(200).json(voucher);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
VoucherRouter.post('/',   async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a voucher',
            schema: { 
                $code: "TH_01",
                $discount: "10000",
                $condition: "100000",
                $expiredDate: "2024-12-31",
            }
        } 
    */
    try {
        const newVoucher = await VoucherService.handleCreateVoucher(req.body);
        res.status(201).json({
            message: 'Voucher created successfully',
            data: newVoucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
VoucherRouter.put('/:id',   async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a voucher',
            schema: { 
                $code: "TH_01",
                $discount: "10000",
                $condition: "100000",
                $expiredDate: "2024-12-31",
            }
        } 
    */
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({ message: 'Invalid voucher ID format' });
        }
        const voucherId = new Types.ObjectId(req.params.id);
        const updatedVoucher = await VoucherService.handleUpdateVoucher(voucherId, req.body);
        if (!updatedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.status(200).json({
            message: 'Voucher updated successfully',
            data: updatedVoucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
VoucherRouter.delete('/:id',   async (req, res) => {
    try {
        if (Types.ObjectId.isValid(req.params.id) === false) {
            return res.status(400).json({ message: 'Invalid voucher ID format' });
        }
        const voucherId = new Types.ObjectId(req.params.id);
        const deletedVoucher = await VoucherService.handleDeleteVoucher(voucherId);
        if (!deletedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.status(200).json({
            message: 'Voucher deleted successfully',
            data: deletedVoucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
