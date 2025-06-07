import express from "express"
import router from "./routes/index";
import mongoose from "mongoose";
///import fileUpload from "express-fileupload"        
import dotenv from 'dotenv';
import { ProductRouter } from './routes/product';
import { PostRouter } from './routes/post';
import { OrderRouter } from './routes/order';
import { OrderStatusRouter } from './routes/orderStatus';
import { CustomerRouter } from './routes/customer';
import { UserRoute } from './routes/user';
import UploadRouter from './routes/upload';
import fs from 'fs';
import path from 'path';
import { EntityType } from './services/UploadService';
import swaggerUi from "swagger-ui-express";

dotenv.config();
const mongoURL = process.env.DEPLOYMENT_DB_URL || "";
const app = express();
//app.use(fileUpload())
// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// Create upload directories if they don't exist
const createUploadDirs = () => {
  // Create main uploads directory
  const mainDir = 'uploads';
  if (!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir);
  }
  
  // Create subdirectories for each entity type
  Object.values(EntityType).forEach(type => {
    const dir = path.join(mainDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  
  // Create common directory for miscellaneous uploads
  const commonDir = path.join(mainDir, 'common');
  if (!fs.existsSync(commonDir)) {
    fs.mkdirSync(commonDir);
  }
};

// Create necessary upload directories on startup
createUploadDirs();

const port = process.env.PORT || 4000; 

// Connect to MongoDB
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

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Cấu hình CORS đầy đủ
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    
    // Xử lý preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Setup Swagger documentation
// Note: swagger_output.json is generated at build time by swagger.js
let swaggerFile;
try {
  // Use a dynamic import approach that works with TypeScript
  swaggerFile = fs.readFileSync(path.resolve(__dirname, '../swagger_output.json'), 'utf8');
  swaggerFile = JSON.parse(swaggerFile);
} catch (error) {
  console.error('Error loading swagger file:', error);
  swaggerFile = { swagger: "2.0", info: { title: "API Documentation", version: "1.0.0" } };
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', router);
app.use('/api/product', ProductRouter);
app.use('/api/post', PostRouter);
app.use('/api/order', OrderRouter);
app.use('/api/orderStatus', OrderStatusRouter);
app.use('/api/customer', CustomerRouter);
app.use('/api/user', UserRoute);
app.use('/api/upload', UploadRouter);
app.listen(port as number,'0.0.0.0');

console.log(`Server is running on port ${port}`);