
import express from "express"
import router from "./routes/index";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.DEPLOYMENT_DB_URL || "";
const app = express();
const port = process.env.PORT || 4000; 

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'My API',
          version: '1.0.0',
          description: 'API documentation using Swagger',
      },
      servers: [
          {
              url: 'https://qiheal-backend.onrender.com/api',
          },
      ],
 components: {
   securitySchemes: {
       bearerAuth: {
           type: 'http',
           scheme: 'bearer',
           bearerFormat: 'JWT', 
       },
   },
},
  },
  apis: ['./src/routes/*.ts'], // Path to your API docs
};
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
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(express.json({ limit: '10mb' }));
app.use(cors({origin:'*', optionsSuccessStatus: 200}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', router);
console.log('port: ', port);
app.listen(port as number,'0.0.0.0', () => {
  return console.log('Express is listening at render');
});

export default app;