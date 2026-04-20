const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  message: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    default: 'card',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);
