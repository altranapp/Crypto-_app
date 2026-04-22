import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get KYC requests
router.get("/kyc", async (req, res) => {
  try {
    const users = await User.find({
      kycStatus: { $ne: "not_submitted" },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve KYC
router.post("/kyc/approve", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    user.kycStatus = "approved";

    await user.save();

    res.json({ message: "KYC approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject KYC
router.post("/kyc/reject", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    user.kycStatus = "rejected";

    await user.save();

    res.json({ message: "KYC rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change role
router.post("/set-role", async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    user.role = role;

    await user.save();

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
