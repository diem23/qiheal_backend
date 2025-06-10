import { Types } from "mongoose";


export enum SystemSettingName {
    POINT_CONVERSION = "pointConversion",
    CURRENCY = "currency",
    LANGUAGE = "language",
    SITE_SETTINGS = "siteSettings"
}
export interface BaseSystemSetting<TName, TValue> {
    _id: Types.ObjectId
    name: TName;
    value: TValue;
}

export type PointConversion = BaseSystemSetting<
    SystemSettingName.POINT_CONVERSION,
    {
        pointsPerDiscount: number;
        moneyPerDiscount: number;
    }
>;

// Example for another setting
export type CurrencySetting = BaseSystemSetting<
    SystemSettingName.CURRENCY,
    {
        currencyCode: string;
        symbol: string;
    }
>;

// Union type for all settings
export type SystemSetting = PointConversion | CurrencySetting; // | ...other settings