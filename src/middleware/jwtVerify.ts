import { verify} from "jsonwebtoken";

const jwtVerify = (req: any, res: any,next: any) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Internal server error" });
    }
    verify(token,secret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
export default jwtVerify;