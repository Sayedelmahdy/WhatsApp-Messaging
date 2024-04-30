const WebSocket = require('ws');
const whatsappclient = require("./services/WhatsappClient");
const qrcode = require("qrcode");
const wss = new WebSocket.Server({ noServer: true });

let currentQR = null;
let IsAuth = false;

whatsappclient.on('qr', async (qr) => {
  currentQR = qr;
  const qrImage = await qrcode.toDataURL(qr, { errorCorrectionLevel: 'H' });
  const base64Image = qrImage.split(';base64,').pop();
  broadcastToClients({ type: 'Qr', data: base64Image });
});

whatsappclient.on("ready", () => {
  broadcastToClients({ type: 'Ready', data: 'WhatsApp Connected Successfully' });
});

whatsappclient.on("disconnected", () => {
  currentQR = null;
  IsAuth = false;  // Ensure we reset authentication status
});

whatsappclient.on('authenticated', () => {
  IsAuth = true;
});

wss.on('connection', (ws) => {
  if (!IsAuth) {
    sendQRCode(ws);
  } else {
    ws.send(JSON.stringify({ type: 'Authenticated', message: 'You are connected to WhatsApp already' }));
  }

  ws.on('message', (message) => {
    if (message === "is authenticated") {
      ws.send(JSON.stringify({ type: 'Authenticated', message: 'You are connected to WhatsApp already' }));
    }
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

function sendQRCode(ws) {
  if (currentQR && ws.readyState === WebSocket.OPEN) {
    const qrImage = qrcode.toDataURL(currentQR, { errorCorrectionLevel: 'H' })
      .then((base64Image) => {
        const data = base64Image.split(';base64,').pop();
        ws.send(JSON.stringify({ type: 'Qr', data: data }));
      })
      .catch((error) => {
        console.error('Error generating QR code:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error generating QR code' }));
      });
  } else if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'error', message: 'QR code not available' }));
  }
}

function broadcastToClients(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

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
