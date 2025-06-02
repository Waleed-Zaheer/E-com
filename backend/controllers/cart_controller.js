import Cart from "../models/cart.js";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/error.js";

export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: { items: [], total: 0 },
      });
    }

    res.status(200).json({
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (error) {
    next(createError(500, "Error fetching cart"));
  }
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;
  // Get user ID from authenticated request
  if (!req.user && !req.user._id) {
    return next(
      createError(401, "Authentication required from cart controller")
    );
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
        total: product.price * quantity,
      });
    } else {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      // Recalculate total
      cart.total = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    await cart.populate("items.product");
    res.status(200).json({
      message: "Item added to cart",
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (error) {
    console.log("Error adding to cart:", error);
    next(createError(500, "Error adding to cart"));
  }
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(createError(404, "Item not in cart"));
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();

    res.status(200).json({
      message: "Cart updated",
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (error) {
    next(createError(500, "Error updating cart"));
  }
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (error) {
    next(createError(500, "Error removing from cart"));
  }
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalPrice: 0 },
    { new: true }
  );

  if (!cart) return next(createError(404, "Cart not found"));

  res.status(200).json({ message: "Cart cleared successfully", cart });
});
