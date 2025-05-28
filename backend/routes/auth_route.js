import express from "express";
import { login, logout, getProfile } from "../controllers/auth_controller.js";
import { authenticateUser, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateUser, getProfile);

export default router;
