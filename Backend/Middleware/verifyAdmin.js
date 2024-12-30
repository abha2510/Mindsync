const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const verifyAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied: Admin only." });
        }

        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = { verifyAdmin };
