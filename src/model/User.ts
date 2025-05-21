import {model, Schema, Types} from "mongoose"
export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    COLLAB = 'collab',
}
export default interface User {
    _id: Types.ObjectId
    profilePic?: string
    username: string
    password: string
    role?: string
    isActive?: boolean
}
export const DOCUMENT_NAME = 'Users'
export const COLLECTION_NAME = 'Users'
const schema = new Schema<User>({
    profilePic: {type: Schema.Types.String, required: false},
    username: {type: Schema.Types.String, required: true},
    password: {type: Schema.Types.String, required: true},
    role: {type: Schema.Types.String,  default: UserRole.CUSTOMER,enum: Object.values(UserRole)},
}, {
    timestamps: true,
})
export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
