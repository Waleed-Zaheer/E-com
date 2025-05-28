import express from "express";
import { fileURLToPath } from "url";
import {
  registerUser,
  profileUserById,
  deleteUser,
  updateUserProfile,
} from "../controllers/user_controller.js";
import path from "path";
import fs from "fs";
import multer from "multer";

// Get the directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads/profile_avatars");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile", profileUserById);
router.delete("/:id", deleteUser);
router.put("/updateProfile", upload.single("avatar"), updateUserProfile);

export default router;
