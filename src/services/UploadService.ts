import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';

// Set up storage for uploaded files using multer
const storage: StorageEngine = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ): void {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ): void {
        // Generate a unique file name
        const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1E9).toString();
        const fileExtension: string = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // File name
    }
});

export const upload = multer({ storage: storage });