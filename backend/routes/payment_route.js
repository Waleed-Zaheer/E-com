import express from "express";
import { getOrderPayment } from "../controllers/payment_controller.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.get("/payment/:orderId", verifyToken, getOrderPayment);

export default router;
