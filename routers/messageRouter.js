const express = require('express');
const multer = require('multer'); // Import multer
const router = new express.Router();
const qrcode = require("qrcode");
const whatsappclient = require("../services/WhatsappClient")

// Configure multer
let currentQR = null;

whatsappclient.on("qr", (qr) => {
  currentQR = qr; // Update current QR code
});

/**
 * @swagger
 * /qr:
 *   get:
 *     summary: QrCode of Whatsapp
 *     description: send qr code to user.
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get('/qr', async (req, res) => {
  try {
    if (currentQR) {
      // Generate QR code as an image
      const qrImage = await qrcode.toDataURL(currentQR, { errorCorrectionLevel: 'H' });
      // Convert QR code image to base64
      const base64Image = qrImage.split(';base64,').pop();
      res.send(base64Image); // Send base64-encoded QR code image to user
    } else {
      res.status(404).send("QR code not available");
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Error generating QR code");
  }
});
/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Refresh QrCode of Whatsapp
 *     description: send refresh qr code to user.
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get('/refresh', (req, res) => {
  // Request a new QR code from the WhatsappClient
  whatsappclient.requestNewQR();
  res.send("New QR code requested");
});

const upload = multer({
  dest: 'uploads/' // Set the destination folder for uploaded files
});

/**
 * @swagger
 * /message:
 *   get:
 *     summary: send message to number
 *     description: send message to number of users.
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
// Use upload middleware for handling file uploads
router.post("/message", upload.single("file"), (req, res) => {
  whatsappclient.sendMessage(req.body.phoneNumber, req.body.message);
  res.send();
});

module.exports = router;
