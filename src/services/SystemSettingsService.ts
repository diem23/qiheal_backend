import { Types } from "mongoose";
import { SystemSettingsRepo } from "../repos/SystemSettingsRepo";
import { SystemSettingName,  } from "../Types/SystemSettingTypes.props";
import SystemSettings from "../model/SystemSettings";

const getAllSystemSettings = async () => {
    // This function will retrieve all system settings
    const systemSettings = await SystemSettingsRepo.getAll();
    if (!systemSettings) {
        throw new Error("No system settings found");
    }
    return systemSettings;
}
const getSystemSettingById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific system setting by its ID
    const systemSetting = await SystemSettingsRepo.getById(id);
    if (!systemSetting) {
        throw new Error("System setting not found");
    }
    return systemSetting;
}
const getSystemSettingByKey = async (key: SystemSettingName) => {
    // This function will retrieve a specific system setting by its key
    const systemSetting = await SystemSettingsRepo.getByKey(key);
    if (!systemSetting) {
        throw new Error(`System setting not found for key: ${key}`);
    }
    return systemSetting;
}
const updateSystemSetting = async (id: Types.ObjectId, systemSetting: SystemSettings) => {
    // This function will update an existing system setting by its ID
    const updatedSystemSetting = await SystemSettingsRepo.update(id, systemSetting);
    if (!updatedSystemSetting) {
        throw new Error("System setting update failed");
    }
    return updatedSystemSetting;
}
export const SystemSettingsService = {
    getAllSystemSettings,
    getSystemSettingById,
    getSystemSettingByKey,
    updateSystemSetting,
};