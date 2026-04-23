import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import kycRoutes from "./routes/kyc.js";

dotenv.config();

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kyc", kycRoutes);

// ✅ SERVE FRONTEND (IMPORTANT FIX)
app.use(express.static(path.join(__dirname, "public")));

// ✅ HANDLE FRONTEND ROUTES
// Only fallback for unknown routes (optional)
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

// CONNECT DATABASE + START SERVER
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ DB ERROR:", err);
});
