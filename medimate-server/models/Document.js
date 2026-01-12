const mongoose = require('mongoose');

// Define the schema for document metadata
const DocumentSchema = new mongoose.Schema({
    // The original name of the file uploaded by the user
    fileName: {
        type: String,
        required: [true, 'File name is required.'],
        trim: true,
    },
    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
    fileType: {
        type: String,
        required: [true, 'File type is required.'],
    },
    // Reference to the patient this document belongs to (from the User collection)
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient ID is required.'],
        index: true,
    },
    // Reference to the user who uploaded the document (patient or hospital)
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploader ID is required.'],
    },
    // Timestamp when the document was uploaded
    uploadTimestamp: {
        type: Date,
        default: Date.now,
    },
    // Pointer to the actual file storage (e.g., IPFS CID, file path)
    storagePointer: {
        type: String,
        required: [true, 'Storage pointer (e.g., IPFS CID) is required.'],
    },
    // Cryptographic hash (SHA-256 recommended) of the file content
    documentHash: {
        type: String,
        required: [true, 'Document hash is required.'],
        unique: true,
        index: true,
    },
    // Optional: Blockchain transaction hash after adding metadata on-chain
    blockchainTxHash: {
        type: String,
        index: true,
    },

    // --- THIS IS THE CORRECTED SECTION ---
    // Optional: Categorize the document type for easier filtering/management
    docCategory: {
        type: String,
        enum: [
            // Keys from UploadDocuments.jsx
            'insurance',
            'idProof',
            'admission',
            'discharge',
            'hospitalBill', // <-- The value from the error
            'pharmacy',
            'labReports',
            'prescriptions',

            // Keys from HospitalUpload.jsx
            'hospitalBills', // <-- Note this is different ("s" at the end)
            'receipts'
        ],
    }
}, {
    // Add timestamps for createdAt and updatedAt automatically
    timestamps: true
});

// Create and export the Mongoose model
module.exports = mongoose.model('Document', DocumentSchema);