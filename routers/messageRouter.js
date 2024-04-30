const express = require('express');
const multer = require('multer'); // Import multer if needed for other routes
const router = express.Router();
const qrcode = require("qrcode"); // Ensure this is used somewhere or remove it
const whatsappclient = require("../services/WhatsappClient");
const app = express();

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Send message to number
 *     description: Send a message to a specified phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number to send the message to.
 *               message:
 *                 type: string
 *                 description: The message to send.
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *       400:
 *         description: Phone number and message are required.
 *       500:
 *         description: Failed to send message.
 */
router.post("/message", async (req, res) => {
  const { phoneNumber, message } = req.body;

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

module.exports = router;
