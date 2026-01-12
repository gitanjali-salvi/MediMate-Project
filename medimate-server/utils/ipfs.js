const { create } = require('ipfs-http-client');

// --- CONFIGURATION ---
// This is the default API address for the IPFS Desktop app or ipfs daemon
const IPFS_API_URL = 'http://127.0.0.1:5001';

let ipfs;

try {
    // Create the IPFS client instance
    ipfs = create({ url: IPFS_API_URL });
    
    console.log('IPFS connection utility initialized successfully.');
    console.log('Connected to IPFS daemon at:', IPFS_API_URL);

} catch (error) {
    console.error('Failed to initialize IPFS utility:', error.message);
    console.error('Please ensure your IPFS daemon is running (e.g., IPFS Desktop).');
    ipfs = null;
}

// Export the instance
module.exports = { ipfs };