import User from "../model/User";
import UserRepo from "../repos/UserRepo";

const handleGetUsers = async (req: any) => {
    const users = await UserRepo.getAlls();
    return users;
}
const handleGetUserById = async (req: any) => {
    const userId = req.params.id;
    const user = await UserRepo.getById(userId);
    return user;
}
const handleCreateUser = async (user: User) => {
    const newUser = await UserRepo.create(user);
    return newUser;
}
const handleUpdateUser = async (req: any) => {
    const userId = req.params.id;
    const updatedUser = await UserRepo.update(userId, req.body);
    return updatedUser;
}
const handleDeleteUser = async (req: any) => {
    const userId = req.params.id;
    const deletedUser = await UserRepo.del(userId);
    return deletedUser;
}
const UserService = {
    handleGetUsers,
    handleGetUserById,
    handleCreateUser,
    handleUpdateUser, 
    handleDeleteUser
};
export default UserService;