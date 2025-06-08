const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'My API',
      description: 'API documentation using Swagger',
      version: '1.0.0',
    },
    host: 'localhost:4000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    securityDefinitions: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
        description: 'JWT Authorization header using the Bearer scheme',
      },
    },
    tags: [
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
        description: 'File upload related endpoints',
      },
    ],
    definitions: {
      UploadResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Upload thành công',
          },
          filePath: {
            type: 'string',
            example: 'uploads/image-123456789.jpg',
          },
          fileName: {
            type: 'string',
            example: 'image-123456789.jpg',
          },
          url: {
            type: 'string',
            example: 'http://localhost:4000/uploads/image-123456789.jpg',
          },
        },
      },
      MultiUploadResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Upload thành công',
          },
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fileName: {
                  type: 'string',
                  example: 'images-123456789.jpg',
                },
                filePath: {
                  type: 'string',
                  example: 'uploads/images-123456789.jpg',
                },
                url: {
                  type: 'string',
                  example: 'http://localhost:4000/uploads/images-123456789.jpg',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Đường dẫn đến các file chứa JSDoc comments
};

const specs = swaggerJsdoc(options);
fs.writeFileSync('./swagger_output.json', JSON.stringify(specs, null, 2));
console.log('Swagger documentation generated successfully'); 