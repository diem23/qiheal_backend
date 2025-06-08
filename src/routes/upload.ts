import express from 'express';
import { uploadImage } from './upload.controller';
import upload from '../services/upload.service';

const UploadRouter = express.Router();

// Route upload một hình ảnh
UploadRouter.post('/image', upload.single('image'), uploadImage);
/* 
    #swagger.tags = ['Upload']
    #swagger.description = 'Endpoint để upload một hình ảnh'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'File hình ảnh cần upload'
    }
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Upload thành công',
        schema: { $ref: '#/definitions/UploadResponse' }
    }
    #swagger.responses[400] = {
        description: 'Không có file nào được upload',
        schema: { 
            success: false, 
            message: 'Không có file nào được upload',
            error: 'No file uploaded'
        }
    }
    #swagger.responses[500] = {
        description: 'Lỗi server',
        schema: { 
            success: false, 
            message: 'Lỗi khi upload file',
            error: 'Error message'
        }
    }
*/

// Route upload nhiều hình ảnh (tối đa 5 ảnh)
UploadRouter.post('/images', upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload',
                error: 'No files uploaded'
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const files = Array.isArray(req.files) ? req.files : [];
        
        const uploadedFiles = files.map(file => {
            const filePath = file.path.replace(/\\/g, '/');
            return {
                fileName: file.filename,
                filePath: filePath,
                url: `${baseUrl}/${filePath}`
            };
        });

        return res.status(200).json({
            success: true,
            message: 'Upload thành công',
            files: uploadedFiles
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: errorMessage
        });
    }
});
/* 
    #swagger.tags = ['Upload']
    #swagger.description = 'Endpoint để upload nhiều hình ảnh (tối đa 5 ảnh)'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['images'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'Các file hình ảnh cần upload (tối đa 5 file)',
        collectionFormat: 'multi'
    }
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Upload thành công',
        schema: { $ref: '#/definitions/MultiUploadResponse' }
    }
    #swagger.responses[400] = {
        description: 'Không có file nào được upload',
        schema: { 
            success: false, 
            message: 'Không có file nào được upload',
            error: 'No files uploaded'
        }
    }
    #swagger.responses[500] = {
        description: 'Lỗi server',
        schema: { 
            success: false, 
            message: 'Lỗi khi upload file',
            error: 'Error message'
        }
    }
*/

export { UploadRouter }; 