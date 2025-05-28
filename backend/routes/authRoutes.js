const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { authenticateUser, isAdmin } = require("../middlewares/auth");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authenticateUser, authController.getProfile);

// Example of a protected admin route
router.get("/admin-dashboard", authenticateUser, isAdmin, (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

module.exports = router;
