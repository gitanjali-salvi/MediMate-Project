const mongoose = require('mongoose');

// Define the schema for the insurance claim
const ClaimSchema = new mongoose.Schema({
    // A user-friendly or system-generated unique ID for the claim
    claimId: {
        type: String,
        required: [true, 'Claim ID is required.'],
        unique: true,
        trim: true,
        index: true, // Index for faster lookups by claim ID
    },
    // Reference to the patient User document
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the 'User' model
        required: [true, 'Patient ID is required.'],
        index: true, // Index for faster queries by patient
    },
    // Reference to the insurer User document
    insurerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the 'User' model
        required: [true, 'Insurer ID is required.'],
        index: true, // Index for faster queries by insurer
    },
    // Array of references to associated Document documents
    documentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document', // Links to the 'Document' model
    }],
    // Reference to the specific Consent document authorizing this claim's data access
    consentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consent', // Links to the 'Consent' model
        required: [true, 'Consent ID is required.'],
    },
    // Current status of the claim processing
    status: {
        type: String,
        enum: ['submitted', 'reviewing', 'approved', 'rejected', 'info_requested'],
        default: 'submitted',
        index: true, // Index for faster queries by status
    },
    // Date the claim was initially submitted
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    // Date the claim was last updated (status change, comment added, etc.)
    lastUpdateDate: {
        type: Date,
        default: Date.now,
    },
    // The monetary amount requested in the claim
    claimAmount: {
        type: Number,
        min: [0, 'Claim amount cannot be negative.'], // Basic validation
    },
    // Optional: The monetary amount approved by the insurer
    approvedAmount: {
        type: Number,
        min: [0, 'Approved amount cannot be negative.'],
    },
    // Optional: Primary diagnosis associated with the claim
    diagnosis: {
        type: String,
        trim: true,
    },
    // Optional: Store structured data extracted by AI (flexible format)
    aiExtractedData: {
        type: mongoose.Schema.Types.Mixed,
    },
    // Optional: Array to log comments/notes during the review process
    comments: [{
        userId: { // User (insurer/admin) who made the comment
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        text: {
            type: String,
            trim: true,
        },
    }],
}, {
    // Add timestamps for createdAt and updatedAt automatically
    timestamps: true
});

// Middleware hook to automatically update 'lastUpdateDate' before saving changes
ClaimSchema.pre('save', function(next) {
    // Only update if the document is modified (avoids unnecessary updates)
    if (this.isModified()) {
        this.lastUpdateDate = Date.now();
    }
    next(); // Continue with the save operation
});

// Middleware hook to automatically update 'lastUpdateDate' for findOneAndUpdate operations
ClaimSchema.pre('findOneAndUpdate', function(next) {
    // Set the lastUpdateDate field in the update operation
    this.set({ lastUpdateDate: Date.now() });
    next(); // Continue with the update operation
});


// Create and export the Mongoose model
module.exports = mongoose.model('Claim', ClaimSchema);