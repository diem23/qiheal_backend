import express from 'express';
import { SystemSettingsRepo } from '../repos/SystemSettingsRepo';
import { SystemSettingsService } from '../services/SystemSettingsService';
import { Types } from 'mongoose';
import { SystemSettingName } from '../Types/SystemSettingTypes.props';
export const SystemSettingRouter = express.Router();
SystemSettingRouter.get('/', async (req, res) => {
    /* #swagger.description = 'Get system settings' */
    try {
        // Simulate fetching system settings
        const systemSettings = await SystemSettingsService.getAllSystemSettings();
        res.status(200).json({
            message: 'Get all system settings successfully',
            count: systemSettings.length,
            data: systemSettings,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
}
);
SystemSettingRouter.get('/:key', async (req, res) => {
    /* #swagger.description = 'Get system setting by key' */
    /* #swagger.parameters['key'] = {
            in: 'path',
            description: 'System setting key',
            required: true,
            type: 'string'
        } 
    */
    try {
        if (!req.params.key) {
            return res.status(400).json({ message: 'System setting key is required' });
        }
        const key = req.params.key as SystemSettingName;
        const systemSetting = await SystemSettingsService.getSystemSettingByKey(key);
        if (!systemSetting) {
            return res.status(404).json({ message: 'System setting not found' });
        }
        res.status(200).json({
            message: 'Get system setting successfully',
            data: systemSetting,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
SystemSettingRouter.post('/', async (req, res) => {
    /* 
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new system setting',
            schema: { 
                $name: "pointConversion",
                $value: {
                    "pointPerDiscount": 5,
                    "moneyPerDiscount": 1000
                }
            }
        } 
    */
    
    try {
        const newSystemSetting = await SystemSettingsRepo.create(req.body);
        res.status(201).json({
            message: 'System setting created successfully',
            data: newSystemSetting,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
SystemSettingRouter.put('/:id', async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a system setting',
            schema: { 
                $name: "pointConversion",
                $value: {
                    "pointPerDiscount": 10,
                    "moneyPerDiscount": 2000
                }
            }
        } 
    */
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'System setting ID is required' });
        }
        const id = new Types.ObjectId(req.params.id);
        const updatedSystemSetting = await SystemSettingsService.updateSystemSetting(id, req.body);
        if (!updatedSystemSetting) {
            return res.status(404).json({ message: 'System setting not found' });
        }
        res.status(200).json({
            message: 'System setting updated successfully',
            data: updatedSystemSetting,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
SystemSettingRouter.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'System setting ID is required' });
        }
        const id = new Types.ObjectId(req.params.id);
        const deletedSystemSetting = await SystemSettingsRepo.del(id);
        if (!deletedSystemSetting) {
            return res.status(404).json({ message: 'System setting not found' });
        }
        res.status(200).json({
            message: 'System setting deleted successfully',
            data: deletedSystemSetting,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
        });
    }
});
