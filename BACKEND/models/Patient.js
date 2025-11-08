const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  // Authentication fields directly in Patient model
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  medicalInfo: {
    bloodGroup: String,
    allergies: [String],
    chronicConditions: [String],
    medications: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);