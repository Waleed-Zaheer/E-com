import express from "express";
import {
  registerUser,
  profileUserById,
  deleteUser,
  updateUserProfile,
} from "../controllers/user_controller.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_avatar/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
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
router.put("/update-profile", upload.single("image"), updateUserProfile);

export default router;
