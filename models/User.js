import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  tier: { type: Number, default: null },
  role: { type: String, default: "user" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);https://crypto-app-y5vn.onrender.com
