 const removeNullValue = (req: any,res: any,  next: any): any => {
    // remove key with null value in req.body
    console.log("req.body in middleware remove null value: ", req.body);
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === null || req.body[key] === undefined || req.body[key] === '') {
                delete req.body[key];
            }
        });
    }
    next();
}
export default removeNullValue;