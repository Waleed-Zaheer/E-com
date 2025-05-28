import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import Auth_routes from "./routes/auth_route.js";
import Users_routes from "./routes/user_route.js";
import Admin_routes from "./routes/admin_route.js";
import Products_routes from "./routes/product_route.js";
import Cart_routes from "./routes/cart_route.js";
import Orders_routes from "./routes/order_route.js";
import Payments_routes from "./routes/payment_route.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: false, // false in dev mode
      //secure: process.env.NODE_ENV === 'production', // Use secure in production
      httpOnly: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/auth", Auth_routes);
app.use("/api/admin", Admin_routes);
app.use("/api/users", Users_routes);
app.use("/api/products", Products_routes);
app.use("/api/cart", Cart_routes);
app.use("/api/orders", Orders_routes);
app.use("/api/payments", Payments_routes);

app.listen(PORT, () => {
  console.log(`Server Live in ${process.env.NODE_ENV} mode on Port : ${PORT}`);
});

export default app;
