import mongoose from "mongoose";
const { Schema, Types } = mongoose;

function formatDateTo24Hour(created_at) {
  return created_at.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true, 
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const paymentIntentSchema = new Schema({
  id: String,
  amount: Number,
  currency: String,
  status: String,
});

const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cart: {
    product: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
      },
    ]
  },
  payment_type: { type: String, required: true, enum: ["cash", "stripe"] },
  order_total: { type: Number, required: true },
  paymentIntent: paymentIntentSchema,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    get: formatDateTo24Hour,
  },
  order_status: {
    type: String,
    required: true,
    enum: ["placed", "refund_requested", "refunded"],
    default: "placed",
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
