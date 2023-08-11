// Import required modules
const express = require('express');
const http = require('http');

// Import utility and config modules
const corsMiddleware = require('./middleware/cors');
const handle404 = require('./middleware/handle404');

const port = process.env.PORT || 8000;

// Create an Express application
const app = express();

// Create an HTTP server from the Express application
const server = http.createServer(app);

// Enable CORS for all routes
app.use(corsMiddleware);

// Import the dotenv module for loading environment variables from a .env file
require('dotenv').config();

// Import database configuration and connect to the database
const connectDB = require('./config/mongoose');
connectDB();

// Middleware for parsing request bodies (form data)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import and use routes
app.use('/', require('./routes'));

// Handle 404 errors
app.use(handle404);

// Start the server on the specified port
server.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on http://localhost:${port}`);
});