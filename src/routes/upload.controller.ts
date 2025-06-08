import { Request, Response } from 'express';
import { UploadResponse } from '../Types/Upload.props';

/**
 * Xử lý upload file hình ảnh
 * @param req Request
 * @param res Response
 * @returns UploadResponse
 */
export const uploadImage = (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload',
                error: 'No file uploaded'
            } as UploadResponse);
        }

        // Tạo URL cho file đã upload
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const filePath = req.file.path.replace(/\\/g, '/'); // Chuẩn hóa đường dẫn
        const fileUrl = `${baseUrl}/${filePath}`;

        return res.status(200).json({
            success: true,
            message: 'Upload thành công',
            filePath: filePath,
            fileName: req.file.filename,
            url: fileUrl
        } as UploadResponse);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: errorMessage
        } as UploadResponse);
    }
}; 