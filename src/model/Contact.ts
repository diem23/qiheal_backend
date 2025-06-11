import { model, Schema } from "mongoose";
export enum ServiceType{
    PRODUCT = "Advise on product",
    SERVICE = "Advise on collaboration",
}
export default interface Contact {
    _id?: string;
    fullname?: string;
    phone?: string;
    email?: string;
    address?: string;
    serviceType?: ServiceType;
    note?: string;
}
export const DOCUMENT_NAME = 'Contacts';
export const COLLECTION_NAME = 'Contacts';
const schema = new Schema<Contact>({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    serviceType: { type: String, enum: Object.values(ServiceType), required: true },
    note: { type: String, default: '' }
}, {
    timestamps: true,
});
export const ContactModel = model<Contact>(DOCUMENT_NAME, schema, COLLECTION_NAME);

