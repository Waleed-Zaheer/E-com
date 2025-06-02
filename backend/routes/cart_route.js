import express from "express";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart_controller.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();
router.use(verifyToken);

router.get("/getCart", getCart);
router.post("/addToCart", addToCart);
router.put("/update/:productId", updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clearCart", clearCart);

export default router;
