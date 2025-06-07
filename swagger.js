const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation using Swagger',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api', // The base path for your API
    },
  ],
  schemes:['http'], // Use 'http' or 'https' based on your API
  host: 'localhost:4000', // The host of your API
  tags:[
    {
        name: 'User',
        description: 'User related endpoints',
    },
    {
        name: 'Product',
        description: 'Product related endpoints',
    },
    {
        name: 'Order',
        description: 'Order related endpoints',
    },
    {
        name: 'Upload',
        description: 'File upload endpoints for different entity types',
    },
  ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//       },
//     },
//   },
//   security: [
//   {
//     bearerAuth: []
//   }
//  ],
securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'authorization', // name of the header, query parameter or cookie
      description: 'Some description...'
    }
  },
  definitions: {}, // Add any reusable schemas here
};

const outputFile = './swagger_output.json'; // The generated Swagger JSON file
const endpointsFiles = ['./src/app.ts', './src/routes/upload.ts']; // Include the upload routes file

swaggerAutogen(outputFile, endpointsFiles, doc);