import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  tier: { type: Number, default: 0 },
  kycStatus: { type: String, default: "pending" },
  dailyProfitRate: { type: Number, default: 0 },
  lastProfitTime: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
