const express = require("express");
const router = express.Router();
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}

// Admin Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required!" });
        }

        // Find admin in the database
        const admin = await User.findOne({ username, role: "admin" });
        if (!admin) return res.status(404).json({ message: "Admin not found!" });

        // Validate password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
            user: {
                username: admin.username,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
