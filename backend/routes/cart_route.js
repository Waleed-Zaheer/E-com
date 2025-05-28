import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} from "../controllers/cart_controller.js";

const router = express.Router();

router.route("/").get(getUserCart).post(addToCart).delete(clearCart);

router.route("/:id").put(updateCartItem).delete(removeFromCart).post(checkout);

export default router;
