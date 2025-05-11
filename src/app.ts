
import express from "express"
import router from "./routes/index";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import cors from "cors"

//onsole.log("DB_URL: ",process.env.DB_URL);
const mongoURL = 'mongodb://localhost:27017/CommercialWeb'

//import router from './routes';
const app = express();
const port = 3000;

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
              url: `http://localhost:${port}/api`,
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
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

export default app;