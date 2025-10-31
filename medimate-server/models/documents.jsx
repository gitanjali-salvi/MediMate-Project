const mongoose = require('mongoose');

// Define the schema for document metadata
const DocumentSchema = new mongoose.Schema({
    // The original name of the file uploaded by the user
    fileName: {
        type: String,
        required: [true, 'File name is required.'], // Added validation message
        trim: true, // Remove leading/trailing whitespace
    },
    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
    fileType: {
        type: String,
        required: [true, 'File type is required.'],
    },
    // Reference to the patient this document belongs to (from the User collection)
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the 'User' model
        required: [true, 'Patient ID is required.'],
        index: true, // Add index for faster queries by patient
    },
    // Reference to the user who uploaded the document (patient or hospital)
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the 'User' model
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
        unique: true, // Ensures the same file content isn't added multiple times
        index: true, // Add index for faster lookups by hash
    },
    // Optional: Blockchain transaction hash after adding metadata on-chain
    blockchainTxHash: {
        type: String,
        index: true, // Index if you plan to query by transaction hash
    },
    // Optional: Categorize the document type for easier filtering/management
    docCategory: {
        type: String,
        enum: [ // Define allowed categories based on your frontend types
            'admission',
            'discharge',
            'hospitalBills',
            'receipts',
            'pharmacy',
            'labReports',
            'insurance',
            'idProof',
            'prescriptions'
            // Add other types as needed
        ],
        // required: true // Make this required if categorization is mandatory
    }
}, {
    // Add timestamps for createdAt and updatedAt automatically
    timestamps: true
});

// Create and export the Mongoose model
module.exports = mongoose.model('Document', DocumentSchema);