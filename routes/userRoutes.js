
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole, adminOrSelfAuthorization } = require('../middleware/auth');
const { validateLogin, validateUser, validateId } = require('../middleware/validation');

// Login route
router.post('/login', validateLogin, userController.login);

// CRUD routes
router.post('/users', validateUser, userController.createUser);
router.get('/users', authenticateToken, userController.getAllUsers);
router.get('/users/:id', authenticateToken, validateId, userController.getUserById);
router.put('/users/:id', authenticateToken, adminOrSelfAuthorization, validateUser, validateId, userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), validateId, userController.deleteUser);

module.exports = router;