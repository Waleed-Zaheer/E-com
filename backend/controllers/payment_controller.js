import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.js";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/error.js";

dotenv.config();

const stripe = new Stripe(process.env.Stripe_SKEY, {
  apiVersion: "2022-11-15",
});

if (!process.env.Stripe_SKEY) {
  throw new Error("❌ Stripe_SKEY is not defined in .env");
}

export const getOrderPayment = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate("cart.product.id");

  if (!order) return next(createError(404, "Order not found"));

  let paymentIntentDetails = null;

  if (order.paymentIntent?.id) {
    try {
      const intent = await stripe.paymentIntents.retrieve(order.paymentIntent.id);
      paymentIntentDetails = {
        id: intent.id,
        amount: intent.amount, 
        currency: intent.currency,
        status: intent.status,
      };
    } catch (err) {
      console.error("❌ Stripe PaymentIntent fetch error:", err.message);
    }
  }

  res.status(200).json({
    message: "Order fetched successfully",
    order: {
      id: order._id,
      user: order.user,
      payment_type: order.payment_type,
      order_total: order.order_total,
      order_status: order.order_status,
      created_at: order.created_at,
      items: order.cart.product.map((item) => ({
        product: item.id?._id,
        name: item.id?.name,
        qty: item.qty,
        price: item.id?.price,
      })),
      paymentIntent: paymentIntentDetails,
    },
  });
});
