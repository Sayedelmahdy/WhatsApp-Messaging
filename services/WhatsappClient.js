const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const whatsappclient = new Client({
    authStrategy: new LocalAuth(),
    webVersion: '2.2412.50',
  webVersionCache: { type: "local" }
});

whatsappclient.on("qr", (qr) => {
    console.log("QR Code generated, please scan to connect.");
    qrcode.generate(qr, { small: true });
});

whatsappclient.on("ready", () => {
    console.log("Client is ready!");
});

whatsappclient.on("authenticated", () => {
    console.log("Authentication successful!");
});

whatsappclient.on('error', (error) => {
    console.error('Error:', error);
});

whatsappclient.on("auth_failure", msg => {
    console.error("Authentication failure:", msg);
});

whatsappclient.on("message", async (msg) => {
    try {
        if (process.env.PROCESS_MESSAGE_FROM_CLIENT === 'true' && msg.from !== "status@broadcast") {
            const contact = await msg.getContact();
            console.log("Message received from:", contact.name, msg.from);
        }
    } catch (error) {
        console.error("Error processing message:", error);
    }
});

whatsappclient.on("disconnected", (reason) => {
    console.log("Client was disconnected:", reason);
    whatsappclient.destroy();
    
});


module.exports = whatsappclient;
