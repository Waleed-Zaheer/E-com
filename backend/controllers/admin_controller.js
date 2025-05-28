import multer from "multer";
import path from "path";
import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import { createError } from "../utils/error.js";

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
}).single("image");

// User Management
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return next(createError(404, "Users not found"));
    }
    res.status(200).json({ message: "List of all Users:", users });
  } catch (err) {
    next(createError(500, "Error fetching users"));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id.select("-password"));
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(createError(500, "Error fetching user"));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    next(createError(500, "Error updating user"));
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Comprehensive input validation
    if (!userId) {
      return next(createError(400, "User ID is required in URL parameters"));
    }

    if (!status) {
      return next(createError(400, "Status is required in request body"));
    }

    // Validate status values
    const allowedStatuses = ["Active", "Blocked"];
    if (!allowedStatuses.includes(status)) {
      return next(createError(400, "Invalid status value"));
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      {
        new: true, // Return the updated document
        runValidators: true, // Run mongoose validation
      }
    );

    if (!updatedUser) {
      return next(createError(500, "Failed to update user status"));
    }

    // Respond with success
    res.status(200).json({
      message: "User status updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);
    next(createError(500, "Internal server error during status update"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(createError(404, "User not found"));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(createError(404, "Error deleting user"));
  }
};

// Product Management
export const createProduct = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      // Validate required fields
      const { name, description, price, category, stock } = req.body;

      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({
          message: "Missing required fields",
          required: "name, description, price, category, stock",
        });
      }

      // Validate price and stock are numbers
      if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({
          message: "Price and stock must be valid numbers",
        });
      }

      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({
          message: "Product image is required",
        });
      }

      const imagePath = `/uploads/products/${req.file.filename}`;

      // Create new product
      const product = new Product({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
        image: imagePath,
      });

      // Save product and handle any validation errors
      const savedProduct = await product.save();
      console.log("Product created successfully:", savedProduct);

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      console.error("Product creation error:", error);

      // Handle MongoDB validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }

      next(createError(500, "Error creating product: " + error.message));
    }
  });
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    next(createError(500, "Error fetching products"));
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    res.status(200).json(product);
  } catch (err) {
    next(createError(500, "Error fetching product"));
  }
};

export const updateProduct = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = `/uploads/products/${req.file.filename}`;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedProduct) return next(createError(404, "Product not found"));
      res.status(200).json(updatedProduct);
    } catch (err) {
      next(createError(500, "Error updating product"));
    }
  });
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return next(createError(404, "Product not found"));
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(createError(500, "Error deleting product"));
  }
};

// Order Management
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate({
      path: "cart.product.id",
      model: "Product",
    });
    res.status(200).json(orders);
  } catch (err) {
    next(createError(500, "Error fetching orders"));
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "cart.product.id",
      model: "Product",
    });

    if (!order) return next(createError(404, "Order not found"));
    res.status(200).json(order);
  } catch (err) {
    next(createError(500, "Error fetching order"));
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_status } = req.body;

    if (!order_status) {
      return next(createError(400, "Order status is required"));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { order_status } },
      { new: true }
    );

    if (!updatedOrder) return next(createError(404, "Order not found"));
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(createError(500, "Error updating order status"));
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, "Order not found"));
    }
    if (order.order_status !== "pending") {
      return next(createError(400, "Order cannot be cancelled"));
    }
    order.order_status = "cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    next(createError(500, "Error cancelling order"));
  }
};

//stats
export const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
