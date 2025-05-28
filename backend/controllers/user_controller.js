import User from "../models/user.js";
import { createError } from "../utils/error.js";
import path from "path";
import fs from "fs";

export const registerUser = async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createError(400, "User already exists"));
  }
  const newUser = new User({ username, email, password, phoneNumber });
  const savedUser = await newUser.save();
  if (!savedUser) {
    return next(createError(400, "User registration failed"));
  }
  res.status(201).json({
    _id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
  });
};

export const profileUserById = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.User || !req.User.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user by ID from token, excluding sensitive fields
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return comprehensive user profile
    res.status(200).json({
      profile: {
        _id: user._id.toString(),
        username: user.username,
        name: user.name || user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(createError(404, "User not found"));
  }
  res.status(200).json({ message: "User deleted successfully" });
};

export const updateUserProfile = async (req, res, next) => {
  try {
    // Log incoming request details
    console.log("Update Profile Request:", {
      user: req.user,
      body: req.body,
      file: req.file,
    });

    // Verify user exists
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.file) {
      // Remove old avatar if exists
      if (user.avatar && user.avatar !== "default.jpg") {
        const oldAvatarPath = path.join(
          "uploads",
          "profile_avatars",
          path.basename(user.avatar)
        );
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      user.avatar = `/uploads/profile_avatars/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      status: updatedUser.status,
    };

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser: userResponse,
    });
  } catch (error) {
    console.error("Detailed Update Profile Error:", {
      message: error.message,
      stack: error.stack,
    });
    next(createError(500, "Failed to update profile"));
  }
};
