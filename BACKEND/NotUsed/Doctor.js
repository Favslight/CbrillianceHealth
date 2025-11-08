/*

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true 
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    profilePhoto: String
  },
  professionalInfo: {
    specialty: { type: String, required: true }, // "Cardiology", "Pediatrics"
    licenseNumber: { type: String, unique: true, required: true },
    qualifications: [String], // ["MBBS", "MD", "FRCS"]
    yearsOfExperience: Number,
    consultationFee: { type: Number, default: 0 } // For payment calculation
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  schedule: {
    daysAvailable: [String], // ["Monday", "Wednesday", "Friday"]
    workingHours: {
      start: String, // "09:00"
      end: String    // "17:00"
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);

*/