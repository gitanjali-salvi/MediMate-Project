const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    insurerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    policyName: {
        type: String,
        required: true,
        trim: true
    },
    policyCode: {
        type: String, // e.g., "H-PLT-001"
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String, // Basic details (e.g., "Comprehensive Health - Individual")
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);