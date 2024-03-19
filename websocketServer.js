const WebSocket = require('ws');
const whatsappclient = require("./services/WhatsappClient");
const qrcode = require("qrcode");
const wss = new WebSocket.Server({ noServer: true });
let currentQR = null;

whatsappclient.on('qr', (qr) => {
  currentQR = qr;
  // Send QR code to connected clients when it changes
  wss.clients.forEach( async (client) => {
    if (client.readyState === WebSocket.OPEN) {
        const qrImage = await qrcode.toDataURL(currentQR, { errorCorrectionLevel: 'H' });
        const base64Image = qrImage.split(';base64,').pop();
      client.send(JSON.stringify({ type: 'Qr', data: base64Image }));
    }
  });
});
whatsappclient.on("ready", (qr) => {
   
    wss.clients.forEach( async (client) => {
      if (client.readyState === WebSocket.OPEN) {
        
        client.send(JSON.stringify({type:'Ready',data : 'WhatsApp Connected Successfully' }));
      }
    });
  });
async function sendQRCode(ws) {
  try {
    if (currentQR) {
      const qrImage = await qrcode.toDataURL(currentQR, { errorCorrectionLevel: 'H' });
      const base64Image = qrImage.split(';base64,').pop();
      ws.send(JSON.stringify({ type: 'Qr', data: base64Image }));
    } else {
      ws.send(JSON.stringify({ type: 'error', message: 'QR code not available' }));
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    ws.send(JSON.stringify({ type: 'error', message: 'Error generating QR code' }));
  }
}
wss.on('connection', (ws) => {
  // Send QR code to client when it connects
  sendQRCode(ws);

  // Handle client messages
  ws.on('message', (message) => {
    // Handle message from client if needed
  });

  // Handle client disconnection
  ws.on('close', () => {
    // Clean up if needed
  });
});
function createWebSocketServer(server) {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}
module.exports = {
    wss,
    sendQRCode,
    createWebSocketServer
  };