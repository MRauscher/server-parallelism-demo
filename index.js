const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API Template',
    version: '1.0.0',
    description: 'Swagger documentation for the Node.js API template built with Express.',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local server',
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./index.js'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a greeting message from the Node.js API template.
 *     responses:
 *       200:
 *         description: A successful response with a greeting message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello from your Node.js API!
 */
app.get('/', (req, res) => {
  res.send('Hello from your Node.js API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
