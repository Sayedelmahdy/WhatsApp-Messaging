const express = require("express");
const messageRouter = require('./routers/messageRouter');
const whatsappclient = require('./services/WhatsappClient');
const swagger = require('./swagger');
const { createWebSocketServer } = require('./websocketServer');

whatsappclient.initialize();

const app = express();
const server = require('http').createServer(app); // Create an HTTP server instance

// Pass the server instance to createWebSocketServer function
createWebSocketServer(server);

// Serve Swagger UI
app.use('/api-docs', swagger.serve, swagger.setup);

// Parse JSON requests
app.use(express.json());

// Define your message router
app.use(messageRouter);

// Redirect root URL to Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

const PORT = process.env.PORT||8080; // Use the provided port or default to 8080
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
