const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

// Định nghĩa cho swagger-autogen
const doc = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    description: 'API documentation using Swagger',
    version: '1.0.0',
  },
  servers: [
    {
      url: '', // The base path for your API
    },
  ],
  schemes:['http'], // Sử dụng http cho local
  host: 'localhost:4000', // Host local
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
        description: 'File upload related endpoints',
    },
  ],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'authorization', // name of the header, query parameter or cookie
      description: 'JWT Authorization header using the Bearer scheme'
    }
  },
  components: {
    schemas: {
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
    }
  },
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
};

// Tạo file swagger_output.json từ swagger-autogen
const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.ts'];

// Thêm routes cho public-upload
const publicUploadRoute = {
  '/api/public-upload': {
    post: {
      tags: ['Upload'],
      description: 'Endpoint công khai để test upload một hình ảnh (không cần xác thực)',
      consumes: ['multipart/form-data'],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'binary',
                  description: 'File hình ảnh cần upload'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Upload thành công',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UploadResponse'
              }
            }
          }
        },
        '400': {
          description: 'Không có file nào được upload'
        },
        '500': {
          description: 'Lỗi server'
        }
      }
    }
  }
};

// Thêm routes cho upload API
const uploadRoutes = {
  '/api/upload/image': {
    post: {
      tags: ['Upload'],
      description: 'Endpoint để upload một hình ảnh',
      security: [{ apiKeyAuth: [] }],
      consumes: ['multipart/form-data'],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'binary',
                  description: 'File hình ảnh cần upload'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Upload thành công',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UploadResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/upload/images': {
    post: {
      tags: ['Upload'],
      description: 'Endpoint để upload nhiều hình ảnh (tối đa 5 ảnh)',
      security: [{ apiKeyAuth: [] }],
      consumes: ['multipart/form-data'],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Các file hình ảnh cần upload (tối đa 5 file)'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Upload thành công',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MultiUploadResponse'
              }
            }
          }
        }
      }
    }
  }
};

// Tạo file swagger_output.json trực tiếp
async function generateSwaggerFile() {
  try {
    // Tạo file swagger_output.json từ swagger-autogen
    const swaggerFile = await swaggerAutogen(outputFile, endpointsFiles, doc);
    
    // Đọc file swagger_output.json
    const swaggerData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    
    // Thêm routes cho upload
    swaggerData.paths = {
      ...swaggerData.paths,
      ...publicUploadRoute,
      ...uploadRoutes
    };
    
    // Ghi lại file swagger_output.json
    fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2));
    console.log('Swagger documentation generated successfully');
  } catch (error) {
    console.error('Error generating swagger documentation:', error);
  }
}

// Thực thi
generateSwaggerFile();