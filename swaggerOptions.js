module.exports = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Cadet Bank API',
      version: '1.0.0',
      description: 'API Documentation for Cadet Bank',
    },
    servers: [
      {
        url: "http://localhost:3000/api/",
      },
    ],
    tags: [
      { name: '/auth' },
      { name: '/users' },
      { name: '/test' }
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'authorization',
        },
      },
    },
  },
  apis: [
    './routers/**/*Routes.js'
  ],
};