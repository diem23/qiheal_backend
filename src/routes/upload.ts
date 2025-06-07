import express from 'express';
import { upload, handleFileUpload, EntityType } from '../services/UploadService';
import verifyRoles from '../middleware/verifyRoles';
import { UserRole } from '../model/User';
import jwtVerify from '../middleware/jwtVerify';

export const UploadRouter = express.Router();

// Define custom request interface for TypeScript
interface UploadRequest extends express.Request {
  fileNames?: string[];
  filePaths?: string[];
}

// Thêm route mặc định để kiểm tra API hoạt động
UploadRouter.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Upload API is working',
    test: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * Generic file upload endpoint that can be used for different entity types
 * @route POST /api/upload/:entityType/:id
 * @param {string} entityType - Type of entity (product, project, post, etc.)
 * @param {string} id - ID of the entity to update with uploaded files
 * @param {file[]} files - Files to upload (multipart/form-data)
 * @returns {object} File paths and names for further processing
 */
UploadRouter.post(
  '/:entityType/:id',
  verifyRoles(UserRole.ADMIN),
  upload.array('files', 5), // Allow up to 5 files
  handleFileUpload,
  async (req: UploadRequest, res) => {
    // #swagger.tags = ['Upload']
    /* #swagger.description = 'Generic file upload endpoint for different entity types' */
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    /*
      #swagger.consumes = ['multipart/form-data']  
      #swagger.parameters['entityType'] = {
          in: 'path',
          description: 'Type of entity (product, project, post, user)',
          required: true,
          type: 'string',
          enum: ['product', 'project', 'post', 'user']
      }
      #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the entity to update',
          required: true,
          type: 'string'
      }
      #swagger.parameters['files'] = {
          in: 'formData',
          type: 'array',
          required: true,
          description: 'Files to upload (up to 5)',
          collectionFormat: 'multi',
          items: { type: 'file' }
      }
      #swagger.responses[200] = {
          description: 'Successfully uploaded files',
          schema: { 
              message: 'Upload successful',
              entityType: 'product',
              entityId: '64a7b3d12e9ab123456789ab',
              files: {
                  fileNames: ['file1.jpg', 'file2.jpg'],
                  filePaths: ['uploads/product/file1.jpg', 'uploads/product/file2.jpg']
              }
          }
      }
      #swagger.responses[400] = {
          description: 'Bad request',
          schema: {
              message: 'Invalid entity type/ID or no files uploaded'
          }
      }
      #swagger.responses[404] = {
          description: 'Entity not found',
          schema: {
              message: 'Entity not found'
          }
      }
      #swagger.responses[500] = {
          description: 'Server error',
          schema: {
              message: 'Failed to process upload',
              error: 'Error message'
          }
      }
    */
    try {
      const entityType = req.params.entityType as EntityType;
      const entityId = req.params.id;
      const fileNames = req.fileNames || [];
      const filePaths = req.filePaths || [];
      
      // Return file information instead of updating the entity directly
      return res.status(200).json({
        message: 'Upload successful',
        entityType,
        entityId,
        files: {
          fileNames,
          filePaths
        }
      });
    } catch (error) {
      console.error('Error handling upload:', error);
      return res.status(500).json({ 
        message: 'Failed to process upload',
        error: (error as Error).message
      });
    }
  }
);

/**
 * Simple file upload endpoint that only requires entity type for folder organization
 * @route POST /api/upload/:entityType
 * @param {string} entityType - Type of entity (product, project, post, etc.)
 * @param {file[]} files - Files to upload (multipart/form-data)
 * @returns {object} File paths and names
 */
UploadRouter.post(
  '/:entityType',
  verifyRoles(UserRole.ADMIN),
  upload.array('files', 5), // Allow up to 5 files
  handleFileUpload,
  async (req: UploadRequest, res) => {
    // #swagger.tags = ['Upload']
    /* #swagger.description = 'Simple file upload endpoint that only requires entity type' */
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    /*
      #swagger.consumes = ['multipart/form-data']  
      #swagger.parameters['entityType'] = {
          in: 'path',
          description: 'Type of entity folder (product, project, post, user)',
          required: true,
          type: 'string',
          enum: ['product', 'project', 'post', 'user']
      }
      #swagger.parameters['files'] = {
          in: 'formData',
          type: 'array',
          required: true,
          description: 'Files to upload (up to 5)',
          collectionFormat: 'multi',
          items: { type: 'file' }
      }
      #swagger.responses[200] = {
          description: 'Successfully uploaded files',
          schema: { 
              message: 'Upload successful',
              entityType: 'product',
              files: {
                  fileNames: ['file1.jpg', 'file2.jpg'],
                  filePaths: ['uploads/product/file1.jpg', 'uploads/product/file2.jpg']
              }
          }
      }
      #swagger.responses[400] = {
          description: 'Bad request',
          schema: {
              message: 'Invalid entity type or no files uploaded'
          }
      }
      #swagger.responses[500] = {
          description: 'Server error',
          schema: {
              message: 'Failed to process upload',
              error: 'Error message'
          }
      }
    */
    try {
      const entityType = req.params.entityType as EntityType;
      const fileNames = req.fileNames || [];
      const filePaths = req.filePaths || [];
      
      // Return file information
      return res.status(200).json({
        message: 'Upload successful',
        entityType,
        files: {
          fileNames,
          filePaths
        }
      });
    } catch (error) {
      console.error('Error handling simple upload:', error);
      return res.status(500).json({ 
        message: 'Failed to process upload',
        error: (error as Error).message
      });
    }
  }
);

/**
 * Simple file upload endpoint for product images
 * @route POST /api/upload/product
 * @param {file[]} files - Files to upload (multipart/form-data)
 * @returns {object} File paths and names
 */
UploadRouter.post(
  '/product',
  upload.array('files', 5), // Allow up to 5 files
  async (req, res) => {
    try {
      // Process files
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      const files = req.files as Express.Multer.File[];
      const fileNames = files.map(file => file.filename);
      const filePaths = files.map(file => file.path);
      
      // Return file information
      return res.status(200).json({
        message: 'Upload successful',
        entityType: 'product',
        files: {
          fileNames,
          filePaths
        }
      });
    } catch (error) {
      console.error('Error handling product upload:', error);
      return res.status(500).json({ 
        message: 'Failed to process upload',
        error: (error as Error).message
      });
    }
  }
);

/**
 * Test upload endpoint without authentication
 * @route POST /api/upload/test-upload
 * @param {file[]} files - Files to upload (multipart/form-data)
 * @returns {object} File paths and names
 */
UploadRouter.post(
  '/test-upload',
  upload.array('files', 5), // Allow up to 5 files
  async (req, res) => {
    try {
      // Process files
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      const files = req.files as Express.Multer.File[];
      const fileNames = files.map(file => file.filename);
      const filePaths = files.map(file => file.path);
      
      // Return file information
      return res.status(200).json({
        message: 'Test upload successful',
        files: {
          fileNames,
          filePaths
        }
      });
    } catch (error) {
      console.error('Error handling test upload:', error);
      return res.status(500).json({ 
        message: 'Failed to process upload',
        error: (error as Error).message
      });
    }
  }
);

/**
 * Public upload endpoint with no authentication
 * @route POST /api/upload/public
 * @param {file[]} files - Files to upload (multipart/form-data)
 * @returns {object} File paths and names
 */
UploadRouter.post(
  '/public',
  upload.array('files', 5), // Allow up to 5 files
  async (req, res) => {
    try {
      // Process files
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      const files = req.files as Express.Multer.File[];
      const fileNames = files.map(file => file.filename);
      const filePaths = files.map(file => file.path);
      
      // Return file information
      return res.status(200).json({
        message: 'Public upload successful',
        files: {
          fileNames,
          filePaths
        }
      });
    } catch (error) {
      console.error('Error handling public upload:', error);
      return res.status(500).json({ 
        message: 'Failed to process upload',
        error: (error as Error).message
      });
    }
  }
);

export default UploadRouter; 