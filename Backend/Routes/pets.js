const express = require('express');
const router = express.Router();
const Pet = require('../Models/Pet');

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
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new pet
router.post('/', async (req, res) => {
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

module.exports = router;