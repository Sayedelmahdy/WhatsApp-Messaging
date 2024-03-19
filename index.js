const express = require("express");
const messageRouter = require('./routers/messageRouter');
const whatsappclient = require('./services/WhatsappClient');
const swagger = require('./swagger');
whatsappclient.initialize();


const app = express();
app.use('/api-docs', swagger.serve, swagger.setup);
app.use(express.json());
app.use(messageRouter);

app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
const PORT = 8080; // Use the provided port or default to 3000
app.listen(PORT, () => console.log(`Server is ready on port ${PORT}`));