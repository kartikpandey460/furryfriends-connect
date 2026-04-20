require('dotenv').config();
const mongoose = require('mongoose');
const Pet = require('./Models/Pet');
const Shelter = require('./Models/Shelter');

const pets = [
  { name: "Bruno", breed: "Indian Pariah", age: "2 years", gender: "Male", size: "Medium", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", description: "A friendly and energetic boy who loves morning walks and belly rubs.", shelterId: "1", vaccinated: true, neutered: true },
  { name: "Bella", breed: "Labrador Mix", age: "1.5 years", gender: "Female", size: "Large", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400", description: "Gentle soul who gets along with kids and other pets beautifully.", shelterId: "1", vaccinated: true, neutered: false },
  { name: "Rocky", breed: "German Shepherd Mix", age: "3 years", gender: "Male", size: "Large", image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400", description: "Loyal and protective. Perfect for families looking for a guardian companion.", shelterId: "2", vaccinated: true, neutered: true },
  { name: "Luna", breed: "Indian Spitz", age: "8 months", gender: "Female", size: "Small", image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400", description: "Playful little pup with the softest fur. Still learning her tricks!", shelterId: "2", vaccinated: true, neutered: false },
  { name: "Max", breed: "Indie", age: "4 years", gender: "Male", size: "Medium", image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=400", description: "Calm and composed. Max loves lazy afternoons and gentle pats.", shelterId: "3", vaccinated: true, neutered: true },
  { name: "Coco", breed: "Beagle Mix", age: "2 years", gender: "Female", size: "Medium", image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400", description: "Curious explorer with an adorable howl. Great with active families.", shelterId: "3", vaccinated: true, neutered: true },
  { name: "Tiger", breed: "Rottweiler Mix", age: "5 years", gender: "Male", size: "Large", image: "https://images.unsplash.com/photo-1558929996-da64ba858215?w=400", description: "Don't let the name fool you — Tiger is a gentle giant who loves cuddles.", shelterId: "4", vaccinated: true, neutered: true },
  { name: "Daisy", breed: "Pomeranian Mix", age: "1 year", gender: "Female", size: "Small", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", description: "A tiny bundle of joy with boundless energy and a fluffy tail.", shelterId: "4", vaccinated: true, neutered: false },
];

const shelters = [
  { _id: "1", name: "Paws of Hope", location: "Koramangala, Bangalore", address: "123 5th Block, Koramangala, Bangalore", phone: "+91 98765 43210", email: "info@pawsofhope.org", description: "A no-kill shelter dedicated to rescuing and rehabilitating stray dogs across South Bangalore.", dogsCount: 24, rating: 4.8, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" },
  { _id: "2", name: "Stray Aid Foundation", location: "Indiranagar, Bangalore", address: "45 St. John's Road, Indiranagar, Bangalore", phone: "+91 98765 43211", email: "help@strayaid.org", description: "Working since 2015 to provide medical care and shelter to abandoned dogs.", dogsCount: 18, rating: 4.6, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
  { _id: "3", name: "FurEver Home NGO", location: "HSR Layout, Bangalore", address: "78 27th Main Road, HSR Layout, Bangalore", phone: "+91 98765 43212", email: "adopt@fureverhome.in", description: "Connecting loving families with rescued street dogs through responsible adoption programs.", dogsCount: 31, rating: 4.9, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400" },
  { _id: "4", name: "Wagging Tails Rescue", location: "Whitefield, Bangalore", address: "22 Brookfield Road, Whitefield, Bangalore", phone: "+91 98765 43213", email: "contact@waggingtails.org", description: "Community-driven rescue focused on vaccinating, neutering, and rehoming stray dogs.", dogsCount: 15, rating: 4.5, image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    await Pet.deleteMany({});
    await Shelter.deleteMany({});
    console.log('Deleted existing pets and shelters');
    
    const insertedPets = await Pet.insertMany(pets);
    const insertedShelters = await Shelter.insertMany(shelters);
    console.log(`Inserted ${insertedPets.length} pets`);
    console.log(`Inserted ${insertedShelters.length} shelters`);
    
    const petCount = await Pet.countDocuments();
    const shelterCount = await Shelter.countDocuments();
    console.log(`Total pets in database: ${petCount}`);
    console.log(`Total shelters in database: ${shelterCount}`);
    
    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();