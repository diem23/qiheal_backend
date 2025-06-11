import { Types } from "mongoose";
import { ContactRepo } from "../repos/ContactRepo";
import Contact from "../model/Contact";

const handleGetAllContacts = async () => {
    const contacts = await ContactRepo.getAlls();
    if (!contacts) {
        throw new Error("No contacts found");
    }
    return contacts;
}
const handleGetContactById = async (contactId: Types.ObjectId) => {
    const contact = await ContactRepo.getById(contactId);
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
}
const handleCreateContact = async (contact: Contact) => {
    const newContact = await ContactRepo.create(contact);
    if (!newContact) {
        throw new Error("Failed to create contact");
    }
    return newContact;
}
const handleUpdateContact = async (contactId: Types.ObjectId, contact: any) => {
    const updatedContact = await ContactRepo.update(contactId, contact);
    if (!updatedContact) {
        throw new Error("Failed to update contact");
    }
    return updatedContact;
}
const handleDeleteContact = async (contactId: Types.ObjectId) => {
    const deletedContact = await ContactRepo.del(contactId);
    if (!deletedContact) {
        throw new Error("Failed to delete contact");
    }
    return deletedContact;
}
export const ContactService = {
    handleGetAllContacts,
    handleGetContactById,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact
};