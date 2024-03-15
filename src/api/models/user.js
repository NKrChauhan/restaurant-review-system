const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'businessOwner'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving a user
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = await jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Find user by email for login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Login failed! Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Login failed! Invalid email or password');
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
