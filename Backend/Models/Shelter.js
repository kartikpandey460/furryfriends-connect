const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dogsCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

shelterSchema.virtual('id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Shelter', shelterSchema);
