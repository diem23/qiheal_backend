import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

// Define supported entity types
export enum EntityType {
  PRODUCT = 'product',
  PROJECT = 'project',
  POST = 'post',
  USER = 'user'
}

// Set up storage for uploaded files using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get entity type from request to organize files in subdirectories
    const entityType = req.params.entityType || 'common';
    cb(null, `uploads/${entityType}/`); // Destination folder with entity type subfolder
  },
  filename: function (req, file, cb) {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // File name
  }
});

// Export multer instance for direct use
export const upload = multer({ storage: storage });

// Helper function to validate entity ID
const validateEntityId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

// Extend Express Request interface to include our custom properties
declare module 'express' {
  interface Request {
    fileNames?: string[];
    filePaths?: string[];
  }
}

// Generic file upload handler
export const handleFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate required parameters
    const entityType = req.params.entityType as EntityType;
    const entityId = req.params.id; // Có thể không tồn tại trong route /:entityType

    if (!Object.values(EntityType).includes(entityType)) {
      return res.status(400).json({ message: `Invalid entity type. Supported types: ${Object.values(EntityType).join(', ')}` });
    }

    // Chỉ kiểm tra entityId nếu nó tồn tại trong request
    if (entityId && !validateEntityId(entityId)) {
      return res.status(400).json({ message: 'Invalid entity ID' });
    }

    // Process files - this middleware expects upload.array to be called before this function
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Add file information to request for service to use
    const files = req.files as Express.Multer.File[];
    req.fileNames = files.map(file => file.filename);
    req.filePaths = files.map(file => file.path);

    // Continue to the next middleware or controller
    next();
  } catch (error) {
    console.error('Error in file upload handler:', error);
    res.status(500).json({ message: 'File upload failed', error: (error as Error).message });
  }
};