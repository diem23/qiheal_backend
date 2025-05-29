import { UserRole } from "../model/User";

const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: any, res: any, next: any) => {
        if (!req?.user.role) return res.sendStatus(401);
        let roles: UserRole[] = req.user.role;
        if (!Array.isArray(roles)) roles = [roles];
        const rolesArray: string[] = [...allowedRoles];
        //console.log("verifyRoles Middleware: ", roles," space", rolesArray);
        const result = roles.filter(role=>rolesArray.includes(role)).length > 0;
        if (!result) return res.sendStatus(401);
        next();
    };
}
export default verifyRoles;