import express from 'express';
import upload from '../services/UploadService';


const UploadRouter = express.Router();

// Route upload nhiều hình ảnh (tối đa 5 ảnh)
UploadRouter.post('/images', upload.array('images', 5), (req, res) => {
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['images'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Tối đa 5 hình ảnh để upload',
            collectionFormat: 'multi',
            items: { type: 'file' }
        } */
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


export { UploadRouter }; 