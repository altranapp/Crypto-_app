import Deposit from "../models/Deposit.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed
    });

    await user.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
});

export default router;

// GET CURRENT USER
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (err) {
    res.json({ message: "Unauthorized" });
  }
});

// GET ALL DEPOSITS (ADMIN)
router.get("/admin/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find().sort({ date: -1 });
    res.json(deposits);
  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
});

// APPROVE DEPOSIT
router.post("/admin/approve/:id", async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) return res.json({ message: "Deposit not found" });
    if (deposit.status === "approved") {
      return res.json({ message: "Already approved" });
    }

    // update user balance
    const user = await User.findById(deposit.userId);
    user.balance += deposit.amount;
    await user.save();

    // mark deposit as approved
    deposit.status = "approved";
    await deposit.save();

    res.json({ message: "Deposit approved" });

  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
});
