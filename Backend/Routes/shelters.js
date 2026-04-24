const express = require('express');
const router = express.Router();
const Shelter = require('../Models/Shelter');
const { protect, admin } = require('../Middleware/authMiddleware');

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

// POST a new shelter (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const shelter = new Shelter({
    name: req.body.name,
    location: req.body.location,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description,
    dogsCount: req.body.dogsCount || 0,
    rating: req.body.rating || 0,
    image: req.body.image,
  });

  try {
    const newShelter = await shelter.save();
    res.status(201).json(newShelter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a shelter (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    shelter.name = req.body.name || shelter.name;
    shelter.location = req.body.location || shelter.location;
    shelter.address = req.body.address || shelter.address;
    shelter.phone = req.body.phone || shelter.phone;
    shelter.email = req.body.email || shelter.email;
    shelter.description = req.body.description || shelter.description;
    shelter.dogsCount = req.body.dogsCount !== undefined ? req.body.dogsCount : shelter.dogsCount;
    shelter.rating = req.body.rating !== undefined ? req.body.rating : shelter.rating;
    shelter.image = req.body.image || shelter.image;

    const updatedShelter = await shelter.save();
    res.json(updatedShelter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a shelter (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    await Shelter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shelter removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
