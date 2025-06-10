import express from 'express';

import { UserRole } from '../model/User';

import { Types } from 'mongoose';
import { SystemSettingName } from '../Types/SystemSettingTypes.props';
import verifyRoles from '../middleware/verifyRoles';
import { SystemSettingsService } from '../services/SystemSettingsService';
export const SystemSettingsRouter = express.Router();
SystemSettingsRouter.get('/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['SystemSettings']
    try {
        const systemSettings = await SystemSettingsService.getAllSystemSettings();
        res.json(systemSettings);
    } catch (error) {
        console.error("Error fetching system settings:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
SystemSettingsRouter.get('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['SystemSettings']
    try {
        const id = new Types.ObjectId(req.params.id);
        const systemSetting = await SystemSettingsService.getSystemSettingById(id);
        res.json(systemSetting);
    } catch (error) {
        console.error("Error fetching system setting by ID:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
SystemSettingsRouter.get('/key/:key', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['SystemSettings']
    try {
        const key = req.params.key as SystemSettingName;
        const systemSetting = await SystemSettingsService.getSystemSettingByKey(key);
        res.json(systemSetting);
    } catch (error) {
        console.error("Error fetching system setting by key:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
SystemSettingsRouter.put('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    // #swagger.tags = ['SystemSettings']
    try {
        const id = new Types.ObjectId(req.params.id);
        const systemSettingData = req.body;
        const updatedSystemSetting = await SystemSettingsService.updateSystemSetting(id, systemSettingData);
        res.json(updatedSystemSetting);
    } catch (error) {
        console.error("Error updating system setting:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

