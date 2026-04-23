import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // deposit / withdraw
  amount: Number,
  status: { type: String, default: "pending" }
});

export default mongoose.model("Transaction", transactionSchema);
