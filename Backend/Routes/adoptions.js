const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../Models/AdoptionRequest');

// Get all adoption requests
router.get('/', async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one adoption request by id
router.get('/:id', async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new adoption request
router.post('/', async (req, res) => {
  const {
    dogId,
    dogName,
    shelterId,
    name,
    email,
    phone,
    address,
    occupation,
    experience,
    reason,
    housingType,
  } = req.body;

  const newRequest = new AdoptionRequest({
    dogId,
    dogName,
    shelterId,
    name,
    email,
    phone,
    address,
    occupation,
    experience,
    reason,
    housingType,
  });

  try {
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update request status
router.patch('/:id/status', async (req, res) => {
  try {
    const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
