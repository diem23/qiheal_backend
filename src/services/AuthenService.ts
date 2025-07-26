import bcrypt from 'bcrypt';
import UserRepo from '../repos/UserRepo';
import { sign } from 'jsonwebtoken';
import User, { UserRole } from '../model/User';
import { CustomerService } from './CustomerService';
import { OAuth2Client } from 'google-auth-library';
import Customer from '../model/Customer';
import { get, Types } from 'mongoose';
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
        throw new Error("Admin không thể đăng ký qua API này");
    }
    const oldUser = await UserRepo.findByUsername(req.body.username);
    if (oldUser) throw new Error("Người dùng đã được đăng ký")
    const user = await UserRepo.create(req.body);
    return user;
}
const getAccessToken = (user: any) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("Không tìm thấy secret key");
    const accessToken = sign(user, secretKey);
    return {
        accessToken: accessToken
    }
}
// Allow users to login with username, email, or phone number
const handleLogin = async (userInfo: any)=>{
    console.log("userInfo: ", userInfo.username);
    let user: User | null = null;
    let customer: Customer | null = null;
    console.log("userInfo: ", userInfo);
    if (checkEmailFormat(userInfo.email)) {
        customer = await CustomerService.handleGetCustomerByEmail(userInfo.username);
        if (!customer) throw new Error("Không tìm thấy khách hàng");
        customer.user = customer.user as User;
        user = customer.user;
    } 
    else if (checkPhoneFormat(userInfo.phone)) {
        customer = await CustomerService.handleGetByPhone(userInfo.username);
        if (!customer) throw new Error("Không tìm thấy khách hàng");
        customer.user = customer.user as User;
        user = customer.user;
    }
    else user = await UserRepo.findByUsername(userInfo.username);
    if (!user) throw new Error("Không tìm thấy người dùng");
    if (!user.password) throw new Error("Mật khẩu chưa được thiết lập");
    const isMatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không chính xác");
    if (!customer && user.role?.includes(UserRole.CUSTOMER)) {
        customer = await CustomerService.handleGetCustomerByUserId(user._id as Types.ObjectId);
        if (!customer) throw new Error("Không tìm thấy khách hàng cho người dùng này");
    }
    const userData = {
        userId: user._id as Types.ObjectId,
        customerId: customer?._id as Types.ObjectId || undefined,
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
    if (!payload) throw new Error("Google token không hợp lệ");
    const userInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
    return userInfo;
}
const handleGoogleLogin = async (token: string) => {
    console.log("start checking Google login");
    const userinfo = await checkGoogleLogin(token);
    console.log("after checking Google login");
    if (!userinfo.email) throw new Error("Không tìm thấy email trong token Google");
    const existedUser = await UserRepo.findByEmail(userinfo.email);
    let userToken = {}
    if (!existedUser) {
        const user: User= {
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
        if (!createdUser) throw new Error("Tạo người dùng thất bại trong quá trình đăng nhập Google");
    
        userToken = {
            userId: createdUser.userId,
            customerId: createdUser.customerId,
            username: user.username,
            role: user.role,
        }
    } else {
        const customer = await CustomerService.handleGetCustomerByUserId(existedUser._id as Types.ObjectId);
        userToken = {
            userId: existedUser._id as Types.ObjectId,
            customerId: customer._id as Types.ObjectId,
            username: existedUser.username,
            role: existedUser.role,
            profilePic: existedUser.profilePic || '',
        };
    }
    
    return await getAccessToken(userToken);
}
export default{
    handleSignup,
    checkEmailFormat,
    handleGoogleLogin,
    handleLogin
}