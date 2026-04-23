import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET USERS
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET TRANSACTIONS
router.get("/transactions", async (req, res) => {
  const tx = await Transaction.find();
  res.json(tx);
});

// APPROVE TRANSACTION
router.post("/approve/:id", async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  const user = await User.findById(tx.userId);

  if (tx.type === "deposit") {
    user.balance += tx.amount;
  }

  if (tx.type === "withdraw") {
    user.balance -= tx.amount;
  }

  tx.status = "approved";

  await user.save();
  await tx.save();

  res.json({ message: "Approved" });
});

export default router;
