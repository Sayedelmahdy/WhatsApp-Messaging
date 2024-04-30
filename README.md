# WhatsApp Messaging Project

This Node.js project leverages the `whatsapp-web.js` library to enable programmatic interactions with WhatsApp. It provides functionality to send messages via a REST API and establishes a WebSocket connection for real-time QR code authentication.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [WebSocket Interface](#websocket-interface)
- [Production Considerations](#production-considerations)

## Technologies Used
- **Node.js**: Server-side JavaScript runtime environment.
- **Express**: Minimalist web framework for Node.js.
- **whatsapp-web.js**: Library for interacting with WhatsApp Web.
- **Multer**: Middleware for handling `multipart/form-data`, used for uploading files.
- **QR Code**: For generating QR codes required for WhatsApp Web authentication.

## Getting Started

### Prerequisites
- Node.js and npm (Node package manager) installed on your system.

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/whatsapp-messaging.git
cd whatsapp-messaging
npm install
```

### Running the Server
Start the server with:
```bash
npm start
```
This will initiate the server on `localhost:8080` and set up the WebSocket connection for QR code reception and the REST API for message sending.

## API Endpoints

### `/message` - Send Message
**POST** `/api/message`
- **Description**: Sends a WhatsApp message to the specified phone number.
- **Request Body**:
  ```json
  {
    "phoneNumber": "20Phonenumber@c.us",
    "message": "Your message text here"
  }
  ```

## WebSocket Interface

### Connection Setup
Connect to the WebSocket server via:
```url
ws://localhost:8080
```
Upon connection, a QR code will be sent as base64 encoded data. Scan this QR code with the WhatsApp app to authenticate.

### WebSocket Messages
- **QR Code**: When a QR code is received, it will be in the following format:
  ```json
  { "type": "Qr", "data": "<base64-encoded-image>" }
  ```
- **Connection Ready**: Notification when the WebSocket is ready to send messages:
  ```json
  { "type": "Ready", "data": "WhatsApp Connected Successfully" }
  ```

## Production Considerations

### Security
- Implement HTTPS for secure communications.
- Secure WebSocket connections to prevent unauthorized access.

### Monitoring and Logging
- Utilize tools like PM2 for process management and monitoring.
- Configure logging with libraries like Winston or Morgan for comprehensive log management.

### Scalability
- Consider a load balancing solution if scaling to multiple instances.

### Documentation
- Maintain and update Swagger API documentation accessible via:
  ```url
  http://localhost:8080/api-docs
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
- **[Your Name](https://github.com/yourusername)** - Initial work and documentation.

## Contributing
Contributions are welcome! Please refer to the repository's [CONTRIBUTION.md](CONTRIBUTION.md) for contribution guidelines.
