const router = require('express').Router();
const User = require('../models/User');

// Submit KYC
router.post('/submit', async (req, res) => {
  try {
    const { userId, name, country, phone, sex } = req.body;

    const user = await User.findById(userId);

    user.name = name;
    user.country = country;
    user.phone = phone;
    user.sex = sex;

    user.kycStatus = 'pending';

    await user.save();

    res.json({ message: "KYC submitted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
