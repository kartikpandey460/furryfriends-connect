require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const petRoutes = require('./Routes/pets');
const authRoutes = require('./Routes/auth');
const adoptionRoutes = require('./Routes/adoptions');
const shelterRoutes = require('./Routes/shelters');
const donationRoutes = require('./Routes/donations');
const adminRoutes = require('./Routes/admin');
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://dhruvmendiratta:dhruvmendiratta123@furrysouls.cm5trza.mongodb.net/FurrySoulsdotcom')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));