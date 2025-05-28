import express from "express";
import { verifyToken } from "../middlewares/jwt.js";
import { authenticateUser, isAdmin } from "../middlewares/auth.js";
import {
  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,

  // Product Management
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,

  // Order Management
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,

  // Dashboard
  getStats,
} from "../controllers/admin_controller.js";

// Multer for file uploads
import multer from "multer";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/"); // Ensure this directory exists
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

// Apply middleware to all admin routes
router.use(verifyToken);
router.use(authenticateUser);
router.use(isAdmin);

// User Management Routes
router.get("/getAllUsers", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/updateUserStatus/:userId", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Product Management Routes
router.post("/createProduct", upload.single("image"), createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

// Order Management Routes
router.get("/getAllOrders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id/cancel", cancelOrder);

// Dashboard Stats
router.get("/stats", getStats);

// Error handling middleware specific to admin routes
router.use((err, req, res, next) => {
  console.error("Admin Route Error:", err);

  // Handle multer file upload errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred in admin routes",
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

export default router;
