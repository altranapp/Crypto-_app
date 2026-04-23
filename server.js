import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Test route
import path from "path";

const __dirname = new URL('.', import.meta.url).pathname;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
