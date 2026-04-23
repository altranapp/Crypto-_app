import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();


// ============================
// GET ALL USERS
// ============================
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// GET ALL TRANSACTIONS
// ============================
router.get("/transactions", protect, adminOnly, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// APPROVE TRANSACTION
// ============================
router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const user = await User.findById(transaction.userId);

    // 🔥 DEPOSIT → ADD BALANCE
    if (transaction.type === "deposit") {
      user.balance += transaction.amount;
    }

    // 🔥 WITHDRAW → DEDUCT BALANCE
    if (transaction.type === "withdraw") {
      user.balance -= transaction.amount;
    }

    transaction.status = "approved";

    await user.save();
    await transaction.save();

    res.json({ message: "Transaction approved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// REJECT TRANSACTION
// ============================
router.post("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    transaction.status = "rejected";

    await transaction.save();

    res.json({ message: "Transaction rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
