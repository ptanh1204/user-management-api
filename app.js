// app.js - Main application file
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});