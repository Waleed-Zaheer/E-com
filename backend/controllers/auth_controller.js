import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.Username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status, // Include status in token
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        blocked: false,
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        blocked: false,
      });
    }

    // Check user status - BLOCK LOGIN IF USER IS BLOCKED
    if (user.status === "Blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact administrator.",
        blocked: true,
      });
    }

    // Ensure role is correct before generating token
    if (user.role !== "Admin" && user.role !== "Customer") {
      user.role = "Customer"; // Default role
      await user.save();
    }

    // Generate token
    const token = generateToken(user);

    // Set session
    req.session.user = {
      id: user._id,
      role: user.role,
      status: user.status,
    };

    // Set JWT as HTTP-only cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Respond with user details
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      blocked: false,
    });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.clearCookie("connect.sid");
    res.clearCookie("access_token");
    res.json({ message: "Logged out" });
  });
};

export const getProfile = (req, res) => {
  res.json({ profile: req.user });
};
