import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductsByName,
  searchProducts,
} from "../controllers/product_controller.js";

const router = express.Router();

// Get all products
router.get("/getAllProducts", getAllProducts);

// Search & Filters
router.get("/category/:category", getProductsByCategory);
router.get("/name/:name", getProductsByName);
router.get("/search/:query", searchProducts);

export default router;
