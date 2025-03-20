const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const verifyAdminToken = (req, res, next) => {
    try {
        if (!JWT_SECRET) {
            console.error("JWT_SECRET_KEY is missing from environment variables.");
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("Missing or invalid Authorization header.");
            return res.status(401).json({ message: 'Access Denied. No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log("🔐 Received Token: ", token); // Log token for debugging

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error("❌ Token verification error: ", err.message);
                return res.status(403).json({ message: 'Invalid credentials' });
            }

            console.log("✅ Decoded User: ", user); // Log decoded user
            req.user = user;
            next();
        });

    } catch (error) {
        console.error("🔥 Error in verifyAdminToken middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = verifyAdminToken;
