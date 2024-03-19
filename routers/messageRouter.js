const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();
const qrcode = require("qrcode");
const whatsappclient = require("../services/WhatsappClient")
// Configure multer
const upload = multer({ dest: 'uploads/' });
const app = express();

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
router.post("/message", upload.single("file"), async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const message = req.body.message;

  // Check if phoneNumber and message are provided
  if (!phoneNumber || !message) {
    return res.status(400).json({ success: false, message: "Phone number and message are required." });
  }

  try {
    // Send the message using whatsappclient with a timeout of 120 seconds
    const sendMessagePromise = whatsappclient.sendMessage(phoneNumber, message);
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Message sending timed out."));
      }, 120000); // 120 seconds timeout
    });

    // Wait for either the message to be sent or the timeout to occur
    await Promise.race([sendMessagePromise, timeoutPromise]);

    // If we reached here, the message was sent successfully within the timeout
    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to send message." });
  }
});

module.exports =router;
  