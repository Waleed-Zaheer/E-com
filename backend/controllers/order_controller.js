import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/error.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0)
    return next(createError(400, "Cart is empty"));

  // Optional: reduce stock from products
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product) return next(createError(404, "Product not found"));

    if (product.stockCount < item.quantity) {
      return next(
        createError(400, `Insufficient stock for product: ${product.name}`)
      );
    }

    product.stockCount -= item.quantity;
    await product.save();
  }

  const order = new Order({
    user: req.user._id,
    items: cart.items,
    totalPrice: cart.totalPrice,
    status: "Processing",
    shippingAddress: req.body.shippingAddress || null,
    paymentMethod: req.body.paymentMethod || "Cash on Delivery",
  });

  const savedOrder = await order.save();
  if (!savedOrder) return next(createError(500, "Failed to create order"));

  // Clear the user's cart after placing the order
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalPrice: 0 }
  );

  res
    .status(201)
    .json({ message: "Order placed successfully", order: savedOrder });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) return next(createError(404, "Order not found"));
  if (order.user.toString() !== req.user._id.toString()) {
    return next(createError(403, "Unauthorized access"));
  }

  res.status(200).json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(createError(404, "Order not found"));

  order.status = status;
  await order.save();

  res.status(200).json({ message: "Order status updated", order });
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(createError(404, "Order not found"));

  await order.remove();
  res.status(200).json({ message: "Order deleted" });
});

export const getAllOrdersByUser = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.userId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  if (!orders) return next(createError(404, "No orders found for this user"));

  res.status(200).json(orders);
});
