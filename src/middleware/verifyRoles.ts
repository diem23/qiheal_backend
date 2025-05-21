const verifyRoles = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray: string[] = [...allowedRoles];
        const result = req.roles.filter((role: string) => rolesArray.includes(role)).length > 0;
        if (!result) return res.sendStatus(401);
        next();
    };
}
export default verifyRoles;