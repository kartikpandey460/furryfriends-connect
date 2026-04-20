const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  dogId: {
    type: String,
    required: true,
  },
  dogName: {
    type: String,
    required: true,
  },
  shelterId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
  },
  experience: {
    type: String,
  },
  reason: {
    type: String,
    required: true,
  },
  housingType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'farm'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
