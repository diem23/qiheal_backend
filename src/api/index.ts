// api/index.js
import serverless from 'serverless-http';
import app from '../app';    // đường dẫn tới file build của bạn

export const handler = serverless(app);
