const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next(); // Continue to the protected route
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
