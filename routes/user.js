import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/* =========================
   🔐 AUTH MIDDLEWARE
========================= */
function auth(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* =========================
   👤 GET USER PROFILE
   (Used by dashboard loadUser())
========================= */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📊 SELECT TIER
========================= */
router.post("/tier", auth, async (req, res) => {
  try {
    const { tier } = req.body;

    const tiers = {
      1: { min: 300, profit: 2 },
      2: { min: 500, profit: 3 },
      3: { min: 1000, profit: 5 }
    };

    if (!tiers[tier]) {
      return res.status(400).json({ message: "Invalid tier" });
    }

    const user = await User.findById(req.user.id);

    if (user.balance < tiers[tier].min) {
      return res.json({
        message: `Minimum $${tiers[tier].min} required`
      });
    }

    user.tier = tier;
    user.profit = tiers[tier].profit;

    await user.save();

    res.json({ message: "Tier activated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   💰 REQUEST DEPOSIT
========================= */
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.json({ message: "Invalid amount" });
    }

    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount,
      status: "pending"
    });

    res.json({ message: "Deposit request sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   💸 REQUEST WITHDRAW
========================= */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (amount > user.balance) {
      return res.json({ message: "Insufficient balance" });
    }

    await Transaction.create({
      userId: req.user.id,
      type: "withdraw",
      amount,
      status: "pending"
    });

    res.json({ message: "Withdraw request sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📜 TRANSACTION HISTORY
========================= */
router.get("/history", auth, async (req, res) => {
  try {
    const history = await Transaction.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(history);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
