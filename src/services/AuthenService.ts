import bcrypt from 'bcrypt';
import UserRepo from '../repos/UserRepo';
import { sign } from 'jsonwebtoken';
import { UserRole } from '../model/User';
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
    
    const user = await UserRepo.findByUsername(userInfo.username);
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
    handleLogin
}