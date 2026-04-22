const router = require('express').Router();
const User = require('../models/User');

router.get('/balance/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ balance: user.balance });
});

module.exports = router;
