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
  schemes:['https'], // Use 'http' or 'https' based on your API
  host: 'qiheal-backend.onrender.com', // The host of your API
  tags:[
    {
        name: 'Authen',
        description: 'Authen related endpoints',
    },
    {
        name: 'Guest',
        description: 'Guest related endpoints',
    },
    {
        name: 'Post',
        description: 'Post related endpoints',
    },
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
        name: 'Customer',
        description: 'Customer related endpoints',
    },
    {
        name: 'CustomerLevel',
        description: 'CustomerLevel related endpoints',
    },
    {
        name: 'OrderStatus',
        description: 'OrderStatus related endpoints',
    },
    {
        name: 'Upload',
        description: 'Upload related endpoints',
    },
    {
        name: 'Cart',
        description: 'Cart related endpoints',
    },
    {
        name: 'Contact',
        description: 'Contact related endpoints',
    }
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
const endpointsFiles = ['./src/app.ts']; // The entry point of your application

swaggerAutogen(outputFile, endpointsFiles, doc);