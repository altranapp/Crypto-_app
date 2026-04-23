import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  userId: String,
  type: String, // deposit, withdraw, profit
  amount: Number,
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", txSchema);
