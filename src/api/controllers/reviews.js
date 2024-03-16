const express = require('express');
const Restaurant = require('../models/restaurant'); // Assuming your restaurant model
const auth = require('../middleware/auth'); // Import authentication middleware
const authorize = require('../middleware/roles'); // Import RBAC middleware
const asyncHandler = require('express-async-handler')
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')
const Review = require('../models/review')

// Create a new review
router.post('/', auth, authorize('create', 'reviewListing'), asyncHandler(async (req, res) => {
    const { restaurantId, rating, reviewText } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user._id); // Get owner ID from logged-in user
    const user = await User.findById(userId)
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId)
    const restaurant = await Restaurant.findById(restaurantObjectId)
    const newReview = await Review.create({ user, restaurant, rating, reviewText});
    res.status(201).send({ message: 'Review has been successfully submitted', review: newReview});
}));

// Get all review listings (Public access)
router.get('/restaurant/:restaurantId', asyncHandler(async (req, res) => {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.params.restaurantId)
    const restaurant = await Restaurant.findById(restaurantObjectId)
    const reviews = await Review.find({restaurant: restaurant});
    res.status(200).send({restaurant: restaurant, reviews: reviews});
}));

// Get a specific review by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const reviweId = new mongoose.Types.ObjectId(req.params.id);
    const review = await Review.findById(reviweId);
    if (!review) {
    return res.status(404).send({ error: 'Review not found' });
    }
    res.send(review);
}));

// Delete a restaurant listing
router.delete('/:id', auth, authorize('delete', 'reviewListing'), asyncHandler(async (req, res) => {
    // Object Id needs to be created before we go ahead
    const reviweId = new mongoose.Types.ObjectId(req.params.id);
    const review = await Review.findByIdAndDelete(reviweId);
    if (!review) {
    return res.status(404).send({ error: 'Review not found' });
    }
    res.send({ message: 'Review deleted successfully'});
}));

// Create a new review response
router.patch('/:id', auth, authorize('response', 'reviewListing'), asyncHandler(async (req, res) => {
    const reviewId = new mongoose.Types.ObjectId(req.params.id);
    let review = null;
    try{
        review = await Review.findById(reviewId)
    }catch{
        res.status(404).send({message: "Review not found"})
    }
    const { response } = req.body;
    const restaurantId = new mongoose.Types.ObjectId(review.restaurant._id)
    const restaurant = await Restaurant.findById(restaurantId)
    if(req.user._id === restaurant.owner._id.toString()){
        review.response = response;
        await review.save();
        res.status(200).send({ message: "Review response has been successfully submitted", review: review});  
      }
    else{
        res.status(400).send({ message: "Invalid request"});
    }
}));

// Update a restaurant listing (Business Owner only)
router.put('/:id', auth, authorize('update', 'reviewListing'), asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['rating', 'reviewText']; // Allowed fields for update
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidUpdate) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
  
    const reviewId = new mongoose.Types.ObjectId(req.params.id);
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }
    if(req.user._id === review.user._id.toString()){
      updates.forEach(update => review[update] = req.body[update]);
      await review.save();
      res.send(review);  
    }
    res.status(400).send({message: "Error: invalid request for update"})
  }));


module.exports = router;
