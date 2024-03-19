const express = require("express");
const messageRouter = require('./routers/messageRouter');
const whatsappclient = require('./services/WhatsappClient');
const swagger = require('./swagger');
const { createWebSocketServer } = require('./websocketServer');
whatsappclient.initialize();


const app = express();
const server = app.listen(8088, () => {
    console.log(`Server is running on port ${8088}`);
  });

createWebSocketServer(server);
app.use('/api-docs', swagger.serve, swagger.setup);
app.use(express.json());
app.use(messageRouter);

app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
const PORT = process.env.PORT||8080; // Use the provided port or default to 3000
app.listen(PORT, () => console.log(`Server is ready on port ${PORT}`));
