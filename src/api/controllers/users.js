const express = require('express');
const User = require('../models/user');
const asyncHandler = require('express-async-handler')
const auth = require('../middleware/auth'); // Import authentication middleware
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();

// Create a new user (no auth required)
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate role (optional)
  if (!['user', 'admin', 'businessOwner'].includes(role)) {
    return res.status(400).send({ error: 'Invalid role provided' });
  }
  let user = null;
  try{
    user = await User.create({ name, email, password, role }); // Create user with specified role
  }catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Duplicate key error (unique index violation)
      return res.status(400).send({ error: 'User already exist' });
    } else {
      // any other error occured
      return res.status(400).send({ error: 'Invalid data provided' });
    }
  }
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    authToken: user.authToken
  }

  res.status(201).send({ message: 'User created successfully', userData }); // Send user data and success message
}));

// Get user details (requires auth)
router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = req.user; // Get user info from request object (attached by auth middleware)
  const userData = await User.findById(user._id)
  res.send(userData); // Send user details
}));

// Update user details (requires auth)
router.put('/me', auth, asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body); // Get update fields from request body
  const allowedUpdates = ['name', 'email', 'password']; // Allowed fields for update
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try{
    const user = req.user; // Get user info from request object (attached by auth middleware)
    const userData = await User.findById(user._id)
    updates.forEach(update => userData[update] = req.body[update]); // Update user fields
    await userData.save(); // Save updated user data
  }catch(MongoServerError){
    res.status(400).send({message: "Invalid data"})
  }
  res.send(userData); // Send updated user details
}));

// Delete user (requires auth) 
router.delete('/me', auth, asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user_id);
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.send({ message: 'User deleted successfully' });
}));

 
// Login route (POST request)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).send({ error: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    // Generate JWT token with user information
    const token = await user.generateAuthToken();

    res.send({ message: 'Login successful!', token }); // Send token and success message
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Something went wrong, please try again later' });
  }
});

module.exports = router;
