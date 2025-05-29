import { verify} from "jsonwebtoken";

const jwtVerify = (req: any, res: any,next: any) => {
    //console.log("JWT Verify Middleware: ",  req.headers);
    const token = req.headers['authorization'];
    //const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Internal server error" });
    }
    verify(token,secret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        //console.log("JWT Verify Middleware: ", req.user);
        next();
    });
}
export default jwtVerify;