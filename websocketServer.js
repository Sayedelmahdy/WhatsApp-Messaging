const WebSocket = require('ws');
const whatsappclient = require("./services/WhatsappClient");
const qrcode = require("qrcode");
const wss = new WebSocket.Server({ noServer: true });
let currentQR = null;
let IsAuth = false;
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
  whatsappclient.on("disconnected", () => {
    currentQR = null; 
    sendQRCode(ws); 
  });
  whatsappclient.on('authenticated', () => {
    IsAuth=true;
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
  if (!IsAuth) {
  sendQRCode(ws);
  }
  else
  {
    ws.send(JSON.stringify({ type: 'Authenticated', message: 'You are connected to WhatsApp alredy' }))
  }

  // on client messages
  ws.on('message', (message) => {
    if (message==="is authenticated ")
      ws.send(JSON.stringify({ type: 'Authenticated', message: 'You are connected to WhatsApp alredy' }));
  });

  // on client disconnection
  ws.on('close', () => {
    ws.send(JSON.stringify({ type: 'disconnected', message: 'User disconnected' }));
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