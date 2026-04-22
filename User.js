const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  name: String,
  country: String,
  phone: String,
  sex: String,
  kycStatus: { type: String, default: 'not_submitted' }
});

module.exports = mongoose.model('User', userSchema);
