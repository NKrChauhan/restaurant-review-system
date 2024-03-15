const express = require('express');
const Restaurant = require('../models/restaurant'); // Assuming your restaurant model
const auth = require('../middleware/auth'); // Import authentication middleware
const authorize = require('../middleware/roles'); // Import RBAC middleware
const asyncHandler = require('express-async-handler')
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

// Create a new restaurant listing (Business Owner only)
router.post('/', auth, authorize('create', 'restaurantListing'), asyncHandler(async (req, res) => {
  const { name, address, cuisine, description, phone } = req.body;
  const ownerId = new mongoose.Types.ObjectId(req.user._id); // Get owner ID from logged-in user
  const owner = await User.findById(ownerId)
  const newRestaurant = await Restaurant.create({ name, address, cuisine, phone, description, owner });

  res.status(201).send({ message: 'Restaurant created successfully', restaurant: newRestaurant });
}));

// Get all restaurant listings (Public access)
router.get('/', asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.send(restaurants);
}));

// Get a specific restaurant by ID (Public access)
router.get('/:id', asyncHandler(async (req, res) => {
  // Object Id needs to be created before we go ahead
  const restaurantId = new mongoose.Types.ObjectId(req.params.id);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).send({ error: 'Restaurant not found' });
  }
  res.send(restaurant);
}));

// Update a restaurant listing (Business Owner only)
router.put('/:id', auth, authorize('update', 'restaurantListing'), asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'address', 'cuisine', 'description']; // Allowed fields for update
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  const restaurantId = new mongoose.Types.ObjectId(req.params.id);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).send({ error: 'Restaurant not found' });
  }
  console.log(req.user._id, restaurant.owner._id.toString())
  if(req.user._id === restaurant.owner._id.toString()){
    updates.forEach(update => restaurant[update] = req.body[update]);
    await restaurant.save();
    res.send(restaurant);  
  }
  res.status(400).send({message: "Error: invalid request for update"})
}));

// Delete a restaurant listing
router.delete('/:id', auth, authorize('delete', 'restaurantListing'), asyncHandler(async (req, res) => {
  const restaurantId = new mongoose.Types.ObjectId(req.params.id);
  const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
  if (!restaurant) {
    return res.status(404).send({ error: 'Restaurant not found' });
  }
  res.send({ message: 'Restaurant deleted successfully' });
}));

module.exports = router;
