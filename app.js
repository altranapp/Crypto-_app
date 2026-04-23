import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE (must come BEFORE routes)
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ ROUTES (PUT YOUR CODE HERE)
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

export default app;
