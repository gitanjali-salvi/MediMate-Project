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
const mongoURI = 'mongodb+srv://gitanjalisalviii:MediM%40te_23@medimatelogin.o2vovgy.mongodb.net/?retryWrites=true&w=majority&appName=MediMateLogin'
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
const authRoutes = require('./routes/auth'); // Import the auth routes
app.use('/api', authRoutes); // Use the routes with a prefix of /api

app.get('/', (req, res) => {
    res.send('MediMate API is running...');
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});