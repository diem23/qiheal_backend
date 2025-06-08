export type UploadResponse = {
    success: boolean;
    message: string;
    filePath?: string;
    fileName?: string;
    url?: string;
    error?: string;
}; 