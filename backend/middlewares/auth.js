import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../utils/error.js";
dotenv.config();

export const authenticateUser = (req, res, next) => {
  // Check for token in cookies
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user info from token
    req.user = decoded;

    // Check if session exists and matches token
    if (!req.session.user || req.session.user.id !== decoded.id) {
      return res.status(401).json({ message: "Session invalid" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return next(createError(401, "Authentication required"));
    }

    // Case-sensitive comparison with trim
    if (req.user.role.trim() !== "Admin") {
      return next(createError(403, "Access denied: Admin privileges required"));
    }
    next();
  } catch (err) {
    return next(createError(500, "Error checking admin privileges"));
  }
};
