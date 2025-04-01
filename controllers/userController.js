// controllers/userController.js - User related controllers
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// In-memory database
let users = [];
let nextId = 1;

// Login controller
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: nextId++,
            name,
            email,
            password: hashedPassword,
            role: ['admin', 'user'].includes(role) ? role : 'user' // Safety check
        };

        users.push(newUser);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = (req, res) => {
    // Don't return passwords
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
};

// Get user by ID
const getUserById = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
};

// Update user by ID
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, password, role } = req.body;

        // Only admin can change roles
        if (role && role !== users[userIndex].role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can change user roles' });
        }

        // Update user
        users[userIndex] = {
            ...users[userIndex],
            name: name || users[userIndex].name,
            email: email || users[userIndex].email,
            // Only update password if provided
            password: password ? await bcrypt.hash(password, 10) : users[userIndex].password,
            // Only admin can change roles
            role: (role && req.user.role === 'admin') ? role : users[userIndex].role
        };

        // Don't return password
        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user by ID
const deleteUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Remove user
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    // Don't return password
    const { password, ...userWithoutPassword } = deletedUser;
    res.json({ message: 'User deleted successfully', user: userWithoutPassword });
};

// Export controllers
module.exports = {
    login,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    // Export users array for validation middleware
    getUsers: () => users
};