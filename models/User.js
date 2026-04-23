import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  tier: { type: Number, default: null },
  role: { type: String, default: "user" }
});

export default mongoose.model("User", userSchema);
