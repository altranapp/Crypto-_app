const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  balance: { type: Number, default: 0 },

  role: {
    type: String,
    enum: ['user', 'support', 'admin', 'super_admin'],
    default: 'user'
  },

  // KYC
  name: String,
  country: String,
  phone: String,
  sex: String,

  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
