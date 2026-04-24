const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import your JWT auth middleware
const Policy = require('../models/Policy');
const User = require('../models/User');

/**
 * @route   POST /api/policies
 * @desc    Create a new insurance policy
 * @access  Private (Insurer only)
 */
router.post('/', auth, async (req, res) => {
    try {
        // Verify the user has the 'insurer' role
        const user = await User.findById(req.user.id);
        if (user.role !== 'insurer') {
            return res.status(403).json({ message: 'Access denied. Only insurers can create policies.' });
        }

        const { policyName, policyType, coverageDetails, premiumAmount, maxClaimLimit, terms } = req.body;

        const newPolicy = new Policy({
            insurerId: req.user.id, // Set from the auth token
            policyName,
            policyType,
            coverageDetails,
            premiumAmount,
            maxClaimLimit,
            terms
        });

        const policy = await newPolicy.save();
        res.status(201).json(policy);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/policies
 * @desc    Get all active policies for patients to browse
 * @access  Private (Authenticated Users)
 */
router.get('/', auth, async (req, res) => {
    try {
        // Find all active policies and populate the insurer's name
        const policies = await Policy.find({ isActive: true })
            .populate('insurerId', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(policies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/policies/insurer/:insurerId
 * @desc    Get policies created by a specific insurer
 * @access  Private
 */
router.get('/insurer/:insurerId', auth, async (req, res) => {
    try {
        const policies = await Policy.find({ insurerId: req.params.insurerId });
        res.json(policies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;