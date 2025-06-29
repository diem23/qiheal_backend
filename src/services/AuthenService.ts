import bcrypt from 'bcrypt';
import UserRepo from '../repos/UserRepo';
import { sign } from 'jsonwebtoken';
import User, { UserRole } from '../model/User';
import { CustomerService } from './CustomerService';
const checkEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const handleSignup = async (req: any) => {
    if (req.body.role.includes(UserRole.ADMIN)) {
        throw new Error("Admin cannot login through this route!!!")
    }
    const oldUser = await UserRepo.findByUsername(req.body.username);
    if (oldUser) throw new Error("User already registered!!!")
    //console.log("username: ", username);
    //console.log("password: ", password);
    const user = await UserRepo.create(req.body);
    return user;
}
const handleLogin = async (userInfo: any)=>{
    console.log("userInfo: ", userInfo.username);
    let user: User | null = null;
    if (checkEmailFormat(userInfo.username)) {
        let customer = await CustomerService.handleGetCustomerByEmail(userInfo.email);
        if (!customer) throw new Error("Customer not found!!!")
        customer.user = customer.user as User;
        user = customer.user;
    } 
    else user = await UserRepo.findByUsername(userInfo.username);
    if (!user) throw new Error("User not found!!!")
    if (!user.password) throw new Error("Password is not set!!!")
    const isMatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isMatch) throw new Error("Password is incorrect!!!")
    const userData = {
        username: user.username,
        role: user.role
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("Secret key not found!!!")
    const accessToken = sign(userData, secretKey);
    return {
        accessToken: accessToken
    }
}
export default{
    handleSignup,
    checkEmailFormat,
    handleLogin
}