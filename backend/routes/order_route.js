import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrdersByUser,
} from "../controllers/order_controller.js";

import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/status", verifyToken, updateOrderStatus);
router.delete("/:id", verifyToken, deleteOrder);
router.get("/user/:userId", verifyToken, getAllOrdersByUser);

export default router;
