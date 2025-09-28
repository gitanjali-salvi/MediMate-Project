const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/role/:roleName
// @desc    Get all users by a specific role (e.g., 'patient', 'insurer')
router.get('/role/:roleName', async (req, res) => {
    try {
        // Find all users where the 'role' field matches the one in the URL
        const users = await User.find({ role: req.params.roleName }).select('-password'); // .select('-password') prevents sending sensitive data
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;