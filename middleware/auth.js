// middleware/auth.js - Authentication and authorization middleware
const jwt = require('jsonwebtoken');

// Secret key for JWT 
const JWT_SECRET = 'your-secret-key';

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware for role-based authorization
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

// Middleware for admin or self access (users can edit their own data)
const adminOrSelfAuthorization = (req, res, next) => {
    const userId = parseInt(req.params.id);

    if (req.user.role === 'admin' || req.user.id === userId) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. You can only modify your own data.' });
    }
};

module.exports = {
    authenticateToken,
    authorizeRole,
    adminOrSelfAuthorization
};