const express = require('express');
const router = express.Router();
const Consent = require('../models/Consent');
const User = require('../models/User'); // Ensure this line is present

// @route   GET /api/consents/:patientId
// @desc    Get all consents for a patient
router.get('/:patientId', async (req, res) => {
    try {
        const consents = await Consent.find({ patientId: req.params.patientId }).populate('insurerId', 'fullName');
        res.json(consents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/consents
// @desc    Create a new consent
router.post('/', async (req, res) => {
    const { patientId, insurerId, documentId } = req.body;
    try {
        const newConsent = new Consent({
            patientId,
            insurerId,
            documentId,
        });
        const consent = await newConsent.save();
        res.json(consent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT /api/consents/:consentId
// @desc    Update a consent (e.g., revoke)
router.put('/:consentId', async (req, res) => {
    try {
        const consent = await Consent.findById(req.params.consentId);
        if (!consent) {
            return res.status(404).json({ msg: 'Consent not found' });
        }
        consent.status = req.body.status;
        await consent.save();
        res.json(consent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW ROUTES TO ENABLE COMMUNICATION ---

// @route   GET /api/consents/insurer/:insurerId
// @desc    Get all consents granted TO a specific insurer
router.get('/insurer/:insurerId', async (req, res) => {
    try {
        // Find consents for this insurer and populate the patient's name
        const consents = await Consent.find({ insurerId: req.params.insurerId }).populate('patientId', 'fullName');
        res.json(consents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/consents/hospital/patient/:patientId
// @desc    (For Demo) Lets a hospital look up consents for a specific patient
router.get('/hospital/patient/:patientId', async (req, res) => {
    try {
        // Find consents for a specific patient and populate the insurer's name
        const consents = await Consent.find({ patientId: req.params.patientId }).populate('insurerId', 'fullName');
        res.json(consents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;