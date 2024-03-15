const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to User model for the reviewer
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant' // Reference to Restaurant model for the reviewed listing
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    trim: true
  },
  response: { 
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
