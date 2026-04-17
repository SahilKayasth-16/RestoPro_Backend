const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (admin) {
            let isMatch = false;
            try {
                isMatch = await admin.matchPassword(password);
            } catch (err) {
                // If the stored password isn't a valid bcrypt hash, matchPassword might throw or return false
                isMatch = false;
            }

            // Fallback for plain text passwords (auto-migration/fix)
            if (!isMatch && admin.password === password) {
                admin.password = password; // This will trigger the pre-save bcrypt hashing
                await admin.save();
                isMatch = true;
            }

            if (isMatch) {
                return res.json({
                    _id: admin._id,
                    username: admin.username,
                    token: generateToken(admin._id),
                });
            }
        }
        
        res.status(401).json({ message: 'Invalid username or password' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seed admin (Only for development)
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ username });
        if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await Admin.create({ username, password });
        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
