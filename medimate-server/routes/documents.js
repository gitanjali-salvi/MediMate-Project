const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads (multipart/form-data)
const crypto = require('crypto'); // For creating the file hash (built-in Node module)

// Import our new utilities
const { web3, contract } = require('../utils/web3');
const { ipfs } = require('../utils/ipfs');

// Import Mongoose Model
const Document = require('../models/Document');

// Import our new auth middleware
const auth = require('../middleware/auth');

// Configure Multer to store files in memory as buffers
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: 10MB file size limit
});

// --- ROUTES ---

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a document, add to IPFS, and store hash on blockchain
 * @access  Private (Needs Auth Token)
 */
router.post('/upload', [auth, upload.single('document')], async (req, res) => {
    try {
        // 1. Check if all connections are ready
        if (!web3 || !contract) {
            return res.status(503).json({ message: 'Blockchain connection not ready. Check server logs.' });
        }
        if (!ipfs) {
            return res.status(503).json({ message: 'IPFS connection not ready. Is IPFS daemon running?' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // 2. Get data from the request
        const { buffer, originalname, mimetype } = req.file;
        const { patientId, docCategory } = req.body;
        const uploaderId = req.user.id; // From auth middleware

        // 3. Generate SHA-256 hash of the file content
        const documentHash = crypto.createHash('sha256').update(buffer).digest('hex');

        // 4. Add file buffer to IPFS
        let ipfsResult;
        try {
            ipfsResult = await ipfs.add(buffer);
            await ipfs.pin.add(ipfsResult.cid); // Manually pin the file after adding it
            console.log('File added to IPFS. CID:', ipfsResult.cid.toString());
        } catch (ipfsError) {
            console.error('IPFS Upload Error:', ipfsError);
            return res.status(500).json({ message: 'Failed to upload file to IPFS. Is IPFS daemon running?' });
        }
        
        const ipfsCid = ipfsResult.cid.toString();

        // 5. Add metadata to Blockchain (Ganache)
        let txHash;
        try {
            const accounts = await web3.eth.getAccounts();
            // Use the first account from Ganache (default deployer/admin) to send the transaction
            const deployerAccount = accounts[0]; 

            // Call the smart contract function
            const gasEstimate = await contract.methods.addDocument(
                documentHash,
                patientId, // The ID of the patient this doc belongs to
                ipfsCid,
                originalname
            ).estimateGas({ from: deployerAccount });

            const receipt = await contract.methods.addDocument(
                documentHash,
                patientId,
                ipfsCid,
                originalname
            ).send({ from: deployerAccount, gas: gasEstimate.toString() });
            
            txHash = receipt.transactionHash;
            console.log('Metadata added to blockchain. TxHash:', txHash);

        } catch (blockchainError) {
            console.error('Blockchain Error:', blockchainError.message);
            // Check for the "require" message from our smart contract
            if (blockchainError.message.includes("Document hash already exists")) {
                return res.status(400).json({ message: 'This exact document (file content) has already been uploaded.' });
            }
            return res.status(500).json({ message: 'Failed to write metadata to blockchain.', error: blockchainError.message });
        }

        // 6. Save all metadata to MongoDB
        const newDocument = new Document({
            fileName: originalname,
            fileType: mimetype,
            patientId: patientId,
            uploaderId: uploaderId,
            storagePointer: ipfsCid, // Storing the IPFS CID as the pointer
            documentHash: documentHash,
            blockchainTxHash: txHash,
            docCategory: docCategory
        });

        await newDocument.save();

        // 7. Send success response to the frontend
        res.status(201).json({
            message: 'File uploaded, hashed, and registered on blockchain successfully!',
            document: newDocument
        });

    } catch (err) {
        console.error('Upload Process Error:', err);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/documents/patient/:patientId
 * @desc    Get all documents for a specific patient (from MongoDB)
 * @access  Private
 */
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        // Query MongoDB for all documents matching the patientId
        // This is much faster than querying the blockchain every time
        const documents = await Document.find({ patientId: req.params.patientId });
        
        if (!documents) {
            return res.status(404).json({ message: 'No documents found for this patient.' });
        }
        
        res.json(documents);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


/**
 * @route   GET /api/documents/download/:cid
 * @desc    Download/view a file from IPFS using its CID
 * @access  Private (Needs better security)
 */
router.get('/download/:cid', auth, async (req, res) => {
    try {
        // --- TODO: Add Security Check ---
        // Before streaming the file, you should check if the logged-in user 
        // (req.user.id) has permission to view this specific document.
        // This involves checking the 'Document' model, finding the patient,
        // and checking the 'Consent' model if the user is an insurer.
        // For now, we allow any authenticated user to download if they have the CID.
        // --- End Security Check ---

        const cid = req.params.cid;
        if (!ipfs) {
            return res.status(503).json({ message: 'IPFS connection not ready.' });
        }
        
        console.log(`Streaming file from IPFS with CID: ${cid}`);

        // 1. Fetch the file stream from IPFS
        const stream = ipfs.cat(cid);
        
        // 2. Stream the file content to the response
        // We set a generic content type; the browser will handle it.
        // To get the real filename and type, you'd first look up the CID in MongoDB.
        res.setHeader('Content-Type', 'application/octet-stream');
        
        for await (const chunk of stream) {
            res.write(chunk);
        }
        res.end();

    } catch (err) {
        console.error('IPFS Download Error:', err.message);
        res.status(500).send('Failed to retrieve file from IPFS.');
    }
});


module.exports = router;