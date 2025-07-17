import bcrypt from 'bcrypt';
import UserRepo from '../repos/UserRepo';
import { sign } from 'jsonwebtoken';
import User, { UserRole } from '../model/User';
import { CustomerService } from './CustomerService';
import { OAuth2Client } from 'google-auth-library';
import Customer from '../model/Customer';
import { get } from 'mongoose';
const checkEmailFormat = (email: string|undefined) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const checkPhoneFormat = (phone: string| undefined) => {
    if (!phone) return false;
    const phoneRegex = /^\d{10}$/; // Example: 10-digit phone number
    return phoneRegex.test(phone);
}
const handleSignup = async (req: any) => {
    if (req.body.role.includes(UserRole.ADMIN)) {
        throw new Error("Admin cannot signup through this route!!!")
    }
    const oldUser = await UserRepo.findByUsername(req.body.username);
    if (oldUser) throw new Error("User already registered!!!")
    const user = await UserRepo.create(req.body);
    return user;
}
const getAccessToken = (user: User) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("Secret key not found!!!")
    const accessToken = sign(user, secretKey);
    return {
        accessToken: accessToken
    }
}
// Allow users to login with username, email, or phone number
const handleLogin = async (userInfo: any)=>{
    console.log("userInfo: ", userInfo.username);
    let user: User | null = null;
    if (checkEmailFormat(userInfo.email)) {
        let customer = await CustomerService.handleGetCustomerByEmail(userInfo.username);
        if (!customer) throw new Error("Customer not found!!!")
        customer.user = customer.user as User;
        user = customer.user;
    } 
    else if (checkPhoneFormat(userInfo.phone)) {
        let customer = await CustomerService.handleGetByPhone(userInfo.username);
        if (!customer) throw new Error("Customer not found!!!")
        customer.user = customer.user as User;
        user = customer.user;
    }
    else user = await UserRepo.findByUsername(userInfo.username);
    if (!user) throw new Error("User not found!!!")
    if (!user.password) throw new Error("Password is not set!!!")
    const isMatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isMatch) throw new Error("Password is incorrect!!!")
    const userData: User = {
        username: user.username,
        role: user.role
    }
    return await getAccessToken(userData);
   
}
const checkGoogleLogin = async (token: string)=> {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");
    const userInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
    return userInfo;
}
const handleGoogleLogin = async (token: string) => {
    const userinfo = await checkGoogleLogin(token);
    if (!userinfo.email) throw new Error("Email not found in Google token");
    const existedUser = await UserRepo.findByEmail(userinfo.email);
    let user : User ={}
    if (!existedUser) {
        user = {
            username: userinfo.email,
            password: '', // Google login does not require a password
            profilePic: userinfo.picture || '',
            role: [UserRole.CUSTOMER],
        };
        const newCustomerData: Customer = {
            fullname: userinfo.name || '',
            email: userinfo.email,
            phone: '', // Phone number is optional for Google login
        }
        const createdUser = await CustomerService.handleCustomerSignUp(newCustomerData, user);
        if (!createdUser) throw new Error("Failed to create user from Google login");
    }
    else{
        user = {
            username: existedUser.username,
            role: existedUser.role,
            profilePic: existedUser.profilePic || '',
        };
    }
    const userToken = await getAccessToken(user);
    return userToken;
}
export default{
    handleSignup,
    checkEmailFormat,
    handleGoogleLogin,
    handleLogin
}