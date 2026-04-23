import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


// ============================
// REGISTER
// ============================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      balance: 0,
      tier: null,
      role: "user"
    });

    await user.save();

    res.json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        email: user.email,
        balance: user.balance,
        tier: user.tier,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// GET USER PROFILE
// ============================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// SELECT TRADING TIER
// ============================
router.post("/select-tier", protect, async (req, res) => {
  try {
    const { tier } = req.body;

    let minAmount = 0;

    if (tier === 1) minAmount = 300;
    if (tier === 2) minAmount = 500;
    if (tier === 3) minAmount = 1000;

    if (!minAmount) {
      return res.status(400).json({ message: "Invalid tier" });
    }

    const user = await User.findById(req.user.id);

    if (user.balance < minAmount) {
      return res.status(400).json({
        message: `Minimum $${minAmount} required for this tier`
      });
    }

    user.tier = tier;
    await user.save();

    res.json({ message: "Tier selected successfully", tier });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// DEPOSIT REQUEST
// ============================
router.post("/deposit", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      type: "deposit",
      amount,
      status: "pending"
    });

    await transaction.save();

    res.json({ message: "Deposit request sent" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// WITHDRAW REQUEST
// ============================
router.post("/withdraw", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: "withdraw",
      amount,
      status: "pending"
    });

    await transaction.save();

    res.json({ message: "Withdraw request sent" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// TRANSACTION HISTORY
// ============================
router.get("/transactions", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(transactions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
