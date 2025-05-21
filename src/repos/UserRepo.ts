import User, { UserModel } from "../model/User"
import bcrypt from 'bcrypt';
const findByUsername = async (username: string)=>{
    return UserModel.findOne({username: username}).lean().exec();
}
const getAlls = async ():Promise<User[] | null> => {
    const users = await UserModel.find().lean<User[]>().exec()
    return users
}
const create = async (user: User)=> {
    try{
        user.password = await bcrypt.hash(user.password,10)
        const newUser = UserModel.create(user)
        return newUser
    }
    catch (err){
        throw new Error('Failed to create user!!!')
    }
}
export default {
    findByUsername,
    create
}