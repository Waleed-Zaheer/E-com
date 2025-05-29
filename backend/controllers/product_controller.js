import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/error.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  if (!products || products.length === 0) {
    return next(createError(404, "No products found"));
  }
  res.status(200).json({ products });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(createError(404, "Product not found"));
  }
  res.status(200).json({ product });
});

export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ category: req.params.category });
  if (!products || products.length === 0) {
    return next(createError(404, "No products found in this category"));
  }

  res.status(200).json({ products });
});

export const getProductsByName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });

  if (!products || products.length === 0) {
    return next(createError(404, "No products found with this name"));
  }

  res.status(200).json({ products });
});

export const searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });

  if (!products || products.length === 0) {
    return next(createError(404, "No products found"));
  }

  res.status(200).json({ products });
});
