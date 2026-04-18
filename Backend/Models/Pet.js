const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  size: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large'],
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shelterId: {
    type: String,
    required: true,
  },
  vaccinated: {
    type: Boolean,
    default: false,
  },
  neutered: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pet', petSchema);