import multer from 'multer';
import path from 'path';
// Set up storage for uploaded files using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // File name
    }
});
export const upload = multer({ storage: storage });