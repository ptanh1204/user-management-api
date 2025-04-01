// middleware/validation.js - Input validation middleware
const { body, param, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

// Login validation
const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// User validation for create and update operations
const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Email must be valid')
        .custom(async (email, { req }) => {
            const users = userController.getUsers();
            const existingUser = users.find(u => u.email === email && u.id !== parseInt(req.params.id || 0));
            if (existingUser) {
                throw new Error('Email is already in use');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// ID parameter validation
const validateId = [
    param('id').isInt().withMessage('ID must be an integer')
];

module.exports = {
    validateLogin,
    validateUser,
    validateId
};