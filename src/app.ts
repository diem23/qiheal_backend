import express from "express"
import router from "./routes/index";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express"
import cors from "cors"
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
const mongoURL = process.env.DEPLOYMENT_DB_URL || "";
const app = express();

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 4000; 


// Kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      dbName: 'CommercialWeb',
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
connectDB();

///const swaggerDocs = swaggerJSDoc(swaggerOptions)
// Import swagger file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerFile = require('../swagger_output.json');
app.use(express.json({ limit: '10mb' }));
app.use(cors({origin:'*', optionsSuccessStatus: 200}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api' , router);
app.listen(port as number,'0.0.0.0');

export default app;