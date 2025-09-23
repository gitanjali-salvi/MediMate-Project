const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept JSON in request body

// --- MongoDB Connection ---
const mongoURI = 'mongodb+srv://sohamrao25:MediM%40te_25@medimatelogin.aavjdtd.mongodb.net/?retryWrites=true&w=majority&appName=MediMateLogin'
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
const authRoutes = require('./routes/auth'); // Import the auth routes
const consentRoutes = require('./routes/consents'); // Import the consent routes
app.use('/api', authRoutes); // Use the routes with a prefix of /api
app.use('/api/consents', consentRoutes); // Use the consent routes

app.get('/', (req, res) => {
    res.send('MediMate API is running...');
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});