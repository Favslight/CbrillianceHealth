/*

const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  localGovt: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LocalGovernment', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Public', 'Private', 'Teaching', 'Specialist'],
    required: true 
  },
  services: [String], // ["Surgery", "Pediatrics", "Emergency", "Cardiology"]
  contactInfo: {
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: String
  },
  facilities: [String], // ["ICU", "X-Ray", "Laboratory"]
  adminUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);

*/