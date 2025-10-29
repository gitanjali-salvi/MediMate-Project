const mongoose = require('mongoose');

const ConsentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    insurerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: String, // Or another appropriate type for your document identifier
        required: true,
    },
    status: {
        type: String,
        enum: ['granted', 'revoked'],
        default: 'granted',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Consent', ConsentSchema);