import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Karyawan',
      version: '1.0.0',
      description: 'API untuk mengelola data karyawan',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Server development',
      },
    ],
  },
  apis: ['./src/features/karyawan/presentation/routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi };