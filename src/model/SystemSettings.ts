import {model, Schema, Types} from "mongoose"
export default interface SystemSettings {
    _id: Types.ObjectId;
    name: string;
    value: object;
}
export const DOCUMENT_NAME = 'SystemSettings';
export const COLLECTION_NAME = 'SystemSettings';
const schema = new Schema<SystemSettings>({
    name: {type: Schema.Types.String, required: true, unique: true},
    value: {type: Schema.Types.Mixed, required: true} // Use Mixed type to allow any object structure
}, {
    timestamps: true,
});
export const SystemSettingsModel = model<SystemSettings>(DOCUMENT_NAME, schema, COLLECTION_NAME);