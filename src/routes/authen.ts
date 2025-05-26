import AuthenService from "../services/AuthenService";
import express from "express";
export const AuthenRouter = express.Router();
AuthenRouter.post('/signup', async (req, res) => {
    // #swagger.tags = ['Authen']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $username: "minhchau12",
                $password: "123456"
            }
        }
        */
    try {
        const response = await AuthenService.handleSignup(req);
        if (response) {
            return res.status(200).json({
                message: 'Signup successfully',
                data: response,
            });
        }
        return res.status(400).json({
        message: 'Signup failed',
        });  
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
);
AuthenRouter.post('/login', async (req, res)=>{
    // #swagger.tags = ['Authen']
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
        const response = await AuthenService.handleLogin(req);
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
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
})
