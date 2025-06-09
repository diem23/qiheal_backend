import { UserRole } from "../model/User";
import AuthenService from "../services/AuthenService";
import express from "express";
import { CustomerService } from "../services/CustomerService";
export const AuthenRouter = express.Router();
AuthenRouter.post("/signup/customer", async (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Customer login',
            schema: { 
                $username: "john_doe",
                $password: "password123",
                $fullname: "John Doe",
                $phone: "1234567890",
                $email: "ddd@gmail.com",
                $levelId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
    try {
        const customerData ={
            phone: req.body.phone,
            email: req.body.email,
            levelId: req.body.levelId,
        }
        const userData = {
            username: req.body.username,
            password: req.body.password,
            role: [UserRole.CUSTOMER],
        };
        const response = await CustomerService.handleCustomerSignUp(customerData,userData);
        return res.status(200).json({
            message: "signup successfully",
            data: response,
        });
    } catch (error) {
        console.error("signup error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// AuthenRouter.post('/signup/user', async (req, res) => {
//     // #swagger.tags = ['Authen']
//     /* #swagger.parameters['body'] = {
//             in: 'body',
//             description: 'Add a user',
//             schema: { 
//                 $username: "minhchau12",
//                 $password: "123456"
//             }
//         }
//         */
//     try {
//         const response = await AuthenService.handleSignup(req);
//         if (response) {
//             return res.status(200).json({
//                 message: 'Signup successfully',
//                 data: response,
//             });
//         }
//         return res.status(400).json({
//         message: 'Signup failed',
//         });  
//     } catch (error) {
//         console.error('Signup error:', error);
//         return res.status(500).json({
//             message: 'Internal server error',
//             error: error instanceof Error ? error.message : String(error)
//         });
//     }
// }
// );
AuthenRouter.post('/login', async (req, res)=>{
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'use login',
            schema: { 
                $username: "minhchau12",
                $password: "123456"
            }
        }
        */
    try{
        console.log("req.body: ", req.body);
        const response = await AuthenService.handleLogin(req.body);
        if (response) {
            return res.status(200).json({
                message: 'Login successfully',
                data: response,
            });
        }
        return res.status(400).json({
            message: 'Login failed',
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            //message: 'Internal server error',
            error:  error instanceof Error ? error.message : String(error)
        });
    }
})
