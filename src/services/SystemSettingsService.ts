import { Types } from "mongoose";
import { SystemSettingsRepo } from "../repos/SystemSettingsRepo";
import {  SystemSettingName,  } from "../Types/SystemSettingTypes.props";
import SystemSettings from "../model/SystemSettings";
export enum ConversionType {
    POINT_TO_MONEY = "pointsToMoney",
    MONEY_TO_POINT = "moneyToPoints",}
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
const pointAndMoneyConversion = async (conversionType: ConversionType, money: number =0 , point : number =0  ) => {
    const pointSetting = await SystemSettingsRepo.getByKey(SystemSettingName.POINT_CONVERSION);
    if (!pointSetting) {
        throw new Error("Point conversion setting not found");
    }
    const pointConversion = pointSetting.value as { pointPerDiscount: number; moneyPerDiscount: number; };
    if (conversionType === ConversionType.POINT_TO_MONEY) {
        // Convert points to money
        return Math.floor(point / pointConversion.pointPerDiscount * pointConversion.moneyPerDiscount);
    } else if (conversionType === ConversionType.MONEY_TO_POINT) {
        // Convert money to points
        return Math.floor(money / pointConversion.moneyPerDiscount * pointConversion.pointPerDiscount);
    } else {
        throw new Error("Invalid conversion type");
    }
}
const getSystemSettingByKey = async (key: SystemSettingName): Promise<SystemSettings> => {
    // This function will retrieve a specific system setting by its key
    let systemSetting = await SystemSettingsRepo.getByKey(key);
    if (!systemSetting) {
        throw new Error(`System setting not found for key: ${key}`);
    }
    if (!Object.values(SystemSettingName).includes(systemSetting.name as SystemSettingName)) {
        throw new Error(`Invalid system setting name: ${systemSetting.name}`);
    }
    let name = systemSetting.name as SystemSettingName // Ensure the name is of type SystemSettingName
    systemSetting.name = name;
    const s: SystemSettings = {
        _id: systemSetting._id,
        name: systemSetting.name as SystemSettingName.CURRENCY | SystemSettingName.POINT_CONVERSION,
        value: systemSetting.value as { pointsPerDiscount: number; moneyPerDiscount: number; } | { currencyCode: string; symbol: string; },
    }
    return s;
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
    pointAndMoneyConversion,
    getSystemSettingById,
    getSystemSettingByKey,
    updateSystemSetting,
};