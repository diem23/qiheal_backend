import User, { UserModel } from "../model/User"
import bcrypt from 'bcrypt';
const findByUsername = async (username: string)=>{
    return UserModel.findOne({username: username}).lean().exec();
}
const getAlls = async ():Promise<User[] | null> => {
    const users = await UserModel.find().lean<User[]>().exec()
    return users
}
const getById = async (id: string): Promise<User|null> => {
    const user = await UserModel.findById(id).lean().exec()
    return user
}
const update = async (id: string, user: any) => {
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true }).exec()
    return updatedUser
}
const del = async (id: string) => {
    const deletedUser = await UserModel.findByIdAndDelete(id)
    return deletedUser
}
const create = async (user: User)=> {
    try{
        if (!user.username || !user.password) {
            throw new Error('Cần có tên đăng nhập và mật khẩu!');
        }
        user.password = await bcrypt.hash(user.password,10)
        const newUser = UserModel.create(user)
        return newUser
    }
    catch (err){
        throw new Error(user.username + ' không thể tạo người dùng');
    }
}
const findByEmail = async (email: string) => {
    return UserModel.findOne({ email: email }).lean().exec();
}
export default {
    findByUsername,
    findByEmail,
    create,
    getAlls,
    getById,
    update,
    del
}