/*

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  // 95%/5% Split Calculation
  remittanceSplit: {
    principalAmount: { type: Number }, // 95%
    adminAmount: { type: Number }      // 5%
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate split before saving
bookingSchema.pre('save', function(next) {
  if (this.amount) {
    this.remittanceSplit = {
      principalAmount: this.amount * 0.95,
      adminAmount: this.amount * 0.05
    };
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

*/