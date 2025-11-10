// This is a simple CoAP server using Node.js
const coap = require('coap');

// Create the server
const server = coap.createServer();

// Set up a listener for incoming requests
server.on('request', (req, res) => {
  console.log('\n--- Packet Received! ---');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  
  // The payload is a Buffer, so we convert it to a string to read it
  console.log('Payload:', req.payload.toString());

  // Send a response back to the client
  res.end('Hello from Windows Server!'); 
});

// Start listening on the standard CoAP port
server.listen(5683, () => {
  console.log('CoAP server started on port 5683');
});