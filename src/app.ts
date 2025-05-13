
import express from "express"
import router from "./routes/index";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express"
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.DEPLOYMENT_DB_URL || "";
const app = express();
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
const swaggerFile = require('../swagger_output.json');
app.use(express.json({ limit: '10mb' }));
app.use(cors({origin:'*', optionsSuccessStatus: 200}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', router);
console.log('port: ', port);
app.listen(port as number,'0.0.0.0', () => {
  return console.log('Express is listening at render');
});

export default app;