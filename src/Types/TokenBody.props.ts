import { Types } from "mongoose";
import { UserRole } from "../model/User";

export type TokenBody = {
    userId: Types.ObjectId;
    customerId?: Types.ObjectId | undefined;
    username: string | undefined;
    role: UserRole[] |  undefined;
}