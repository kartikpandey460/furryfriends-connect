const express = require('express');
const router = express.Router();
const Donation = require('../Models/Donation');

// GET all donations (admin only)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new donation
router.post('/', async (req, res) => {
  const { name, email, amount, message, paymentMethod } = req.body;

  const newDonation = new Donation({
    name,
    email,
    amount,
    message,
    paymentMethod,
  });

  try {
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET donation statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const totalAmount = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const averageDonation = await Donation.aggregate([
      { $group: { _id: null, average: { $avg: '$amount' } } }
    ]);

    res.json({
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      averageDonation: Math.round(averageDonation[0]?.average || 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
