import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";
import { applyProfit } from "../utils/profit.js";

const router = express.Router();

const TIERS = {
  1: { min: 300, rate: 0.02 },
  2: { min: 500, rate: 0.03 },
  3: { min: 1000, rate: 0.05 }
};

// PROFILE
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  await applyProfit(user);

  res.json(user);
});

// SELECT TIER
router.post("/select-tier", protect, async (req, res) => {
  const { tier } = req.body;

  const user = await User.findById(req.user.id);

  if (!TIERS[tier]) return res.json({ message: "Invalid tier" });

  if (user.balance < TIERS[tier].min) {
    return res.json({ message: `Minimum $${TIERS[tier].min}` });
  }

  user.tier = tier;
  user.dailyProfitRate = TIERS[tier].rate;
  user.lastProfitTime = new Date();

  await user.save();

  res.json({ message: "Tier activated" });
});

// REQUEST DEPOSIT
router.post("/request-deposit", protect, async (req, res) => {
  const { amount } = req.body;

  await Transaction.create({
    userId: req.user.id,
    type: "deposit",
    amount
  });

  res.json({ message: "Deposit request sent" });
});

// REQUEST WITHDRAW
router.post("/request-withdraw", protect, async (req, res) => {
  const { amount } = req.body;

  await Transaction.create({
    userId: req.user.id,
    type: "withdraw",
    amount
  });

  res.json({ message: "Withdraw request sent" });
});

export default router;
