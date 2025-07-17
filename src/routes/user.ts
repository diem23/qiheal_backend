
import express from 'express';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
import UserService from '../services/UserService';
export const UserRoute = express.Router();
UserRoute.get('/', async (req, res) => {
    const response = await UserService.handleGetUsers(req);
    res.status(200).json({
        message: 'Get all users successfully',
        count: response?.length,
        data: response,
    });
});
UserRoute.get('/:id', verifyRoles(UserRole.ADMIN, UserRole.CUSTOMER), async (req, res) => {
    const response = await UserService.handleGetUserById(req);
    if (!response) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(response);
});
UserRoute.post('/', verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $username: "john_doe",
                $password: "securepassword",
                $role: ["customer"]
            }
        } 
    */
    const response = await UserService.handleCreateUser(req.body);
    if (response) {
        return res.status(201).json({
            message: 'User created successfully',
            data: response,
        });
    }
    return res.status(400).json({
        message: 'User creation failed',
    });
});
UserRoute.put('/:id', verifyRoles(UserRole.ADMIN), async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update a user',
            schema: { 
                $username: "john_doe_updated",
                $role: ["collab"]
            }
        } 
    */
    const response = await UserService.handleUpdateUser(req);
    if (response) {
        return res.status(200).json({
            message: 'User updated successfully',
            data: response,
        });
    }
    return res.status(400).json({
        message: 'User update failed',
    });
});
UserRoute.delete('/:id',verifyRoles(UserRole.ADMIN), async (req, res) => {
    const response = await UserService.handleDeleteUser(req.params.id);
    if (response) {
        return res.status(200).json({
            message: 'User deleted successfully',
        });
    }
    return res.status(400).json({
        message: 'User deletion failed',
    });
});