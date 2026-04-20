const express = require('express');
const router = express.Router();
const Shelter = require('../Models/Shelter');

// GET all shelters
router.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find().sort({ name: 1 });
    res.json(shelters.map((shelter) => ({ ...shelter.toObject(), id: shelter._id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single shelter by ID
router.get('/:id', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    res.json({ ...shelter.toObject(), id: shelter._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
