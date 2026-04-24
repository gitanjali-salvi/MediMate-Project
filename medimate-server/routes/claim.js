const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); //
const Claim = require('../models/Claim'); //
const Document = require('../models/Document'); //
const User = require('../models/User'); //

// --- ROUTES ---

/**
 * @route   POST /api/claims
 * @desc    Create a new insurance claim
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
    const { 
        patientId, 
        insurerId, 
        documentIds, 
        consentId,   
        claimAmount, 
        diagnosis 
    } = req.body; //

    try {
        const claimId = `CLM-${Date.now().toString().slice(-6)}`; //

        const newClaim = new Claim({
            claimId,
            patientId,
            insurerId,
            documentIds,
            consentId,
            claimAmount,
            diagnosis,
            status: 'submitted', 
        }); //

        const claim = await newClaim.save(); //
        res.status(201).json(claim); //

    } catch (err) {
        console.error('Error creating claim:', err.message);
        res.status(500).send('Server Error'); //
    }
});

/**
 * @route   GET /api/claims/:claimId/simulate-extraction
 * @desc    DEMO ONLY: Simulate AI data extraction from IPFS documents
 * @access  Private (Insurer)
 */
router.get('/:claimId/simulate-extraction', auth, async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.claimId);
        
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        // Mock data to be shown in the Policy Document for the demo
        const mockData = {
            patientName: "Gitanjali Salvi",
            hospitalName: "City General Hospital",
            totalBillAmount: 50000,
            diagnosisCode: "ICD-10-E11",
            treatmentDate: "2026-04-10",
            policyNumber: "POL-882910",
            verifiedByBlockchain: true
        };

        // Save to the Mixed type field in our model
        claim.aiExtractedData = mockData;
        claim.status = 'reviewing'; 
        await claim.save();

        res.json(mockData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/claims/patient/:patientId
 */
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const claims = await Claim.find({ patientId: req.params.patientId })
            .populate('insurerId', 'fullName') 
            .sort({ submissionDate: -1 });
        
        res.json(claims);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/claims/:id
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id)
            .populate('patientId', 'fullName email')
            .populate('insurerId', 'fullName')
            .populate('documentIds');
            
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        res.json(claim);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/claims/:id
 * @desc    Update status (Approve/Reject)
 */
router.put('/:id', auth, async (req, res) => {
    const { status, approvedAmount, comments } = req.body;

    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        if (status) claim.status = status;
        if (approvedAmount) claim.approvedAmount = approvedAmount;
        
        if (comments) {
            claim.comments.push({
                userId: req.user.id,
                text: comments,
                timestamp: new Date()
            });
        }
        
        const updatedClaim = await claim.save();
        res.json(updatedClaim);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;