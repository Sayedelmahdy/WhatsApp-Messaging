const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Message OTP',
            version: '1.0.0',
            description: '',
        },
    },
    apis: ['./routers/*.js'], // Path to the files containing the JSDoc comments
};

const specs = swaggerJsdoc(options);

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(specs),
};