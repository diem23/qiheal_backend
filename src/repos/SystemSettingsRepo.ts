
import { Types } from "mongoose";
import SystemSettings, { SystemSettingsModel } from "../model/SystemSettings";
import {  SystemSettingName } from "../Types/SystemSettingTypes.props";

const getAll= async () => {
    // This function will retrieve all system settings
    const systemSettings = await SystemSettingsModel.find().lean<SystemSettings[]>().exec()
    if (!systemSettings) {
        throw new Error("No system settings found");
    }
    return systemSettings;
}
const create = async (systemSetting: SystemSettings) => {
    // This function will create a new system setting
    const newSystemSetting = await SystemSettingsModel.create(systemSetting)
    if (!newSystemSetting) {
        throw new Error("System setting creation failed");
    }
    return newSystemSetting;
}
const getById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific system setting by its ID
    const systemSetting = await SystemSettingsModel.findById(id).lean<SystemSettings>().exec()
    if (!systemSetting) {
        throw new Error("System setting not found");
    }
    return systemSetting;
}
const getByKey = async (key: SystemSettingName) => {
    // This function will retrieve a specific system setting by its key
    const systemSetting = await SystemSettingsModel.findOne({ name: key }).lean<SystemSettings>().exec()
    if (!systemSetting) {
        throw new Error(`System setting not found for key: ${key}`);
    }
    return systemSetting;
}
const update = async (id: Types.ObjectId, systemSetting: SystemSettings) => {
    // This function will update an existing system setting by its ID
    const updatedSystemSetting = await SystemSettingsModel.findByIdAndUpdate(id, systemSetting, { new: true }).exec()
    if (!updatedSystemSetting) {
        throw new Error("System setting update failed");
    }
    return updatedSystemSetting;
}
const del = async (id: Types.ObjectId) => {
    // This function will delete a system setting by its ID
    const deletedSystemSetting = await SystemSettingsModel.findByIdAndDelete(id).exec()
    if (!deletedSystemSetting) {
        throw new Error("System setting deletion failed");
    }
    return deletedSystemSetting;
}
export const SystemSettingsRepo = {
    del,
    create,
    getAll,
    getById,
    getByKey,
    update,
};