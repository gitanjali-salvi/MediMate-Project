const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv
const authRoutes = require('./routes/auth');
const consentRoutes = require('./routes/consents'); // Make sure this is also present
const documentRoutes = require('./routes/documents');
const claimRoutes = require('./routes/claims');
const policyRoutes = require('./routes/policies'); // Add this line
const userRoutes = require('./routes/users');

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
app.use('/api', authRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/documents', documentRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/policies', policyRoutes);

app.get('/', (req, res) => {
    res.send('MediMate API is running...');
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});