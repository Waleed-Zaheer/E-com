import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByName,
  searchProducts,
} from "../controllers/product_controller.js";

const router = express.Router();

// Get all products
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);

// Search & Filters
router.get("/category/:category", getProductsByCategory);
router.get("/name/:name", getProductsByName);
router.get("/search/:query", searchProducts);

export default router;
