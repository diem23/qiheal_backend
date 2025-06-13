import { Types } from "mongoose";


export enum SystemSettingName {
    POINT_CONVERSION = "pointConversion",
    CURRENCY = "currency",
    LANGUAGE = "language",
    SITE_SETTINGS = "siteSettings"
}

export type PointConversionValue = {
        pointsPerDiscount: number;
        moneyPerDiscount: number;
    }
