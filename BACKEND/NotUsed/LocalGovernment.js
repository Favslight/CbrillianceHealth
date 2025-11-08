/*

const mongoose = require('mongoose');

const localGovSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  code: { 
    type: String, 
    unique: true,
    uppercase: true,
    required: true
  },
  state: { 
    type: String, 
    default: "Plateau State",
    required: true
  },
  contactInfo: {
    address: String,
    phone: String,
    email: String
  },
  // We'll add admin users later when we create them
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
localGovSchema.index({ state: 1, name: 1 });

module.exports = mongoose.model('LocalGovernment', localGovSchema);

*/