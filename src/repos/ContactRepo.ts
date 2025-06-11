import { Types } from "mongoose";
import Contact, { ContactModel } from "../model/Contact";

const getAlls = async ()  => {
    // This function will retrieve all contacts from the database
    const contacts = await ContactModel.find().sort({ createdAt: -1 }).lean<Contact[]>().exec();
    return contacts;
}
const getById = async (id: Types.ObjectId) => {
    // This function will retrieve a specific contact by its ID
    const contact = await ContactModel.findById(id).lean<Contact>().exec();
    return contact;
}
const create = async (contact: Contact) => {
    // This function will create a new contact in the database
    const newContact = await ContactModel.create(contact);
    return newContact;
}
const update = async (id: Types.ObjectId, contact: any) => {
    // This function will update an existing contact by its ID
    const updatedContact = await ContactModel.findByIdAndUpdate(id, contact, { new: true }).exec();
    return updatedContact;
}
const del = async (id: Types.ObjectId) => {
    // This function will delete a contact by its ID
    const deletedContact = await ContactModel.findByIdAndDelete(id).exec();
    return deletedContact;
}
export const ContactRepo = {
    getAlls,
    getById,
    create,
    update,
    del
};