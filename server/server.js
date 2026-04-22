import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import kycRoutes from "./routes/kyc.js";

dotenv.config();

const app = express();
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kyc", kycRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running");
});

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server started");
  });

})
.catch(err => {
  console.log("DB ERROR:", err);
});
