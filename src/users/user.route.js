const express = require("express");
const router = express.Router();
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Store blacklisted tokens in memory (replace with a database in production)
const blacklist = new Set();

// ✅ Register Route
router.post("/register", async (req, res) => {
    try {
        const { username, email, mobile, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { mobile }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username, email, or mobile already exists" });
        }

        // Create and save new user
        const user = new User({
            username,
            email,
            mobile,
            password,
            role: role || "user",
        });

        await user.save();

        // Exclude the password from the response
        const { password: _, ...userData } = user.toObject();

        res.status(201).json({
            message: "User registered successfully",
            user: userData,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" } // Token expires in 2 hours
        );

        // Send user data without password
        const { password: _, ...userData } = user.toObject();

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Logout Route (Invalidate Token)
router.post("/logout", verifyToken, (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        blacklist.add(token); // Add token to blacklist
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Protected Route: Get User Profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ✅ Middleware to Check if Token is Blacklisted
const checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (blacklist.has(token)) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
    next();
};


// ✅ Exporting Both Router and Middleware
module.exports = { router, checkBlacklist };
