const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Regular expression to validate phone number
        return /^\d{3}-\d{3}-\d{4}$/.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    type: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true }, // Optional state field
      postalCode: { type: String, trim: true } // Optional postal code field
    },
    required: true
  },
  images: {
    type: [String],
    validate: {
      validator: (value) => value.length <= 5, // Limit to 5 images
      message: props => `${props.value.length} images exceed the maximum limit of 5!`
    }
  },
  category: {
    type: String,
    enum: ['Italian', 'Indian', 'Chinese', 'Mexican', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
  },
}, {
  timestamps: true // Add timestamps for created and updated at
});

// Define validation logic
restaurantSchema.pre('save', function(next) {
  // Custom validation checks here
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
