import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String,
  amount: Number,
  status: { type: String, default: "pending" }
}, { timestamps: true }); // ✅ IMPORTANT

export default mongoose.model("Transaction", transactionSchema);
