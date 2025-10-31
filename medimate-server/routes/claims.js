const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const Claim = require('../models/Claim'); // Import Claim model
const Document = require('../models/Document'); // Import Document model
const User = require('../models/User'); // Import User model

// --- ROUTES ---

/**
 * @route   POST /api/claims
 * @desc    Create a new insurance claim
 * @access  Private (Patient/Hospital)
 */
router.post('/', auth, async (req, res) => {
    // Get required data from the request body
    const { 
        patientId, 
        insurerId, 
        documentIds, // Array of Document _id's from the upload step
        consentId,   // The _id of the consent record
        claimAmount, 
        diagnosis 
    } = req.body;

    try {
        // --- TODO: Add Validation ---
        // You should check if the user (req.user.id) is the patient
        // or an authorized hospital user before allowing claim creation.
        // --- End Validation ---

        // Create a unique, human-readable claim ID
        const claimId = `CLM-${Date.now().toString().slice(-6)}`;

        const newClaim = new Claim({
            claimId,
            patientId,
            insurerId,
            documentIds,
            consentId,
            claimAmount,
            diagnosis,
            status: 'submitted', // Initial status
        });

        const claim = await newClaim.save();
        
        // Respond with the newly created claim object
        res.status(201).json(claim);

    } catch (err) {
        console.error('Error creating claim:', err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/claims/patient/:patientId
 * @desc    Get all claims for a specific patient
 * @access  Private (Patient)
 */
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        // Find all claims matching the patientId
        // Sort by submissionDate descending (newest first)
        const claims = await Claim.find({ patientId: req.params.patientId })
            .populate('insurerId', 'fullName') // Replace insurerId with insurer's name
            .sort({ submissionDate: -1 });
        
        res.json(claims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/claims/insurer/:insurerId
 * @desc    Get all claims for a specific insurer
 * @access  Private (Insurer)
 */
router.get('/insurer/:insurerId', auth, async (req, res) => {
    try {
        // Find all claims matching the insurerId
        // Populate the patient's name
        const claims = await Claim.find({ insurerId: req.params.insurerId })
            .populate('patientId', 'fullName email') // Get patient's name and email
            .sort({ submissionDate: 1 }); // Oldest first
        
        res.json(claims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/claims/:claimId (using MongoDB _id)
 * @desc    Get a single claim by its MongoDB _id
 * @access  Private (Insurer/Patient)
 */
router.get('/:claimId', auth, async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.claimId)
            .populate('patientId', 'fullName email phoneNumber') // Get full patient details
            .populate('insurerId', 'fullName') // Get insurer name
            .populate('documentIds'); // Get the full objects for all linked documents
            
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        // --- TODO: Add Security ---
        // Check if req.user.id is either claim.patientId or claim.insurerId
        // --- End Security ---

        res.json(claim);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/claims/:claimId (using MongoDB _id)
 * @desc    Update a claim's status (Approve/Reject)
 * @access  Private (Insurer)
 */
router.put('/:claimId', auth, async (req, res) => {
    const { status, comments, approvedAmount } = req.body;

    try {
        const claim = await Claim.findById(req.params.claimId);
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        // --- TODO: Add Security ---
        // Check if req.user.id is the insurer for this claim
        // if (claim.insurerId.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Not authorized' });
        // }
        // --- End Security ---

        // Update the fields
        if (status) claim.status = status;
        if (approvedAmount) claim.approvedAmount = approvedAmount;
        
        // Add a new comment to the comments array
        if (comments) {
            claim.comments.push({
                userId: req.user.id,
                text: comments,
                timestamp: new Date()
            });
        }
        
        claim.lastUpdateDate = Date.now();
        
        const updatedClaim = await claim.save();
        res.json(updatedClaim);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;