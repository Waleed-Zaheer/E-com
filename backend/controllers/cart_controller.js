import Cart from "../models/cart.js";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/error.js";

export const getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart) {
    return res.status(200).json({ items: [], totalPrice: 0 });
  }

  res.status(200).json(cart);
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(createError(404, "Product not found"));

  if (product.stockCount < quantity) {
    return next(createError(400, "Not enough items in stock"));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }],
      totalPrice: product.price * quantity,
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  const updatedCart = await cart.save();
  if (!updatedCart) return next(createError(400, "Failed to update cart"));

  res.status(200).json(updatedCart);
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(createError(404, "Product not found"));

  if (product.stockCount < quantity) {
    return next(createError(400, "Not enough items in stock"));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(createError(404, "Cart not found"));

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex === -1) return next(createError(404, "Item not found in cart"));

  cart.items[itemIndex].quantity = quantity;
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updatedCart = await cart.save();
  if (!updatedCart) return next(createError(400, "Failed to update cart"));

  res.status(200).json(updatedCart);
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(createError(404, "Cart not found"));

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updatedCart = await cart.save();
  if (!updatedCart) return next(createError(400, "Failed to update cart"));

  res.status(200).json(updatedCart);
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

export const checkout = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(createError(404, "Cart not found"));

  if (cart.items.length === 0) {
    return next(createError(400, "Cart is empty"));
  }

  // Payment processing logic would go here...

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalPrice: 0 },
    { new: true }
  );

  res.status(200).json({ message: "Checkout successful", cart });
});
