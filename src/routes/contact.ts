import express from 'express';
import { Types } from 'mongoose';
import { ContactService } from '../services/ContactService';
export const ContactRouter = express.Router();
ContactRouter.get('/', async (req, res) => {
    try {
        const response = await ContactService.handleGetAllContacts();
        res.status(200).json({
            message: 'Get all contacts successfully',
            count: response.length,
            data: response,
        });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});
ContactRouter.get('/:id', async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        const contactId = new Types.ObjectId(req.params.id);
        const response = await ContactService.handleGetContactById(contactId);
        if (!response) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});
ContactRouter.put('/:id', async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        const contactId = new Types.ObjectId(req.params.id);
        const response = await ContactService.handleUpdateContact(contactId, req.body);
        if (response) {
            return res.status(200).json({
                message: 'Contact updated successfully',
                data: response,
            });
        }
        return res.status(400).json({ message: 'Contact update failed' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});
ContactRouter.delete('/:id', async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        const contactId = new Types.ObjectId(req.params.id);
        const response = await ContactService.handleDeleteContact(contactId);
        if (response) {
            return res.status(200).json({
                message: 'Contact deleted successfully',
                data: response,
            });
        }
        return res.status(400).json({ message: 'Contact deletion failed' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});
