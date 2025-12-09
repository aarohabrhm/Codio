// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided!" });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified; // Attach user info (id) to the request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};