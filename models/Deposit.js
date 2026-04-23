import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  status: { type: String, default: "pending" }, // pending / approved
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Deposit", depositSchema);
