const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables (to get the JWT_SECRET)
dotenv.config({ path: './config.env' }); 

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // The token is often sent as "Bearer <token>", so we split and take the token part
        const tokenString = token.split(' ')[1]; 
        
        if (!tokenString) {
             return res.status(401).json({ message: 'Token format is invalid' });
        }

        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        
        // Add user from payload to the request object
        req.user = decoded.user; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};