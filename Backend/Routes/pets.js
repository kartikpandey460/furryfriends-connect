const express = require('express');
const router = express.Router();
const Pet = require('../Models/Pet');
const { protect, admin } = require('../Middleware/authMiddleware');

// GET all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    const petsWithId = pets.map(pet => ({
      id: pet._id.toString(),
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      image: pet.image,
      description: pet.description,
      shelterId: pet.shelterId,
      vaccinated: pet.vaccinated,
      neutered: pet.neutered,
    }));
    res.json(petsWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const petObject = pet.toObject();
    petObject.id = pet._id.toString();
    res.json(petObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new pet (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    gender: req.body.gender,
    size: req.body.size,
    image: req.body.image,
    description: req.body.description,
    shelterId: req.body.shelterId,
    vaccinated: req.body.vaccinated,
    neutered: req.body.neutered,
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a pet (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.name = req.body.name || pet.name;
    pet.breed = req.body.breed || pet.breed;
    pet.age = req.body.age || pet.age;
    pet.gender = req.body.gender || pet.gender;
    pet.size = req.body.size || pet.size;
    pet.image = req.body.image || pet.image;
    pet.description = req.body.description || pet.description;
    pet.shelterId = req.body.shelterId || pet.shelterId;
    pet.vaccinated = req.body.vaccinated !== undefined ? req.body.vaccinated : pet.vaccinated;
    pet.neutered = req.body.neutered !== undefined ? req.body.neutered : pet.neutered;

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a pet (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;