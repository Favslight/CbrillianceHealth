const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  // Simplified for MVP - just store names
  hospitalName: { 
    type: String, 
    required: true 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  specialty: { 
    type: String, 
    required: true 
  },
  
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  timeSlot: {
    start: String, // "14:30"
    end: String    // "15:00"
  },
  purpose: String,
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // PAYMENT & REMITTANCE (Core MVP feature)
  payment: {
    amount: { 
      type: Number, 
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'transfer', 'cash'],
      default: 'card'
    },
    transactionReference: String,
    paidAt: Date
  },
  
  // 95%/5% SPLIT - AUTOMATIC CALCULATION
  remittance: {
    hospitalShare: Number,    // 95% of payment
    governmentShare: Number,  // 5% of payment
    calculatedAt: Date
  },
  
  notes: String
}, {
  timestamps: true
});

// Automatic 95%/5% calculation when payment is made
bookingSchema.pre('save', function(next) {
  if (this.payment.status === 'paid' && this.payment.amount && !this.remittance.calculatedAt) {
    this.remittance = {
      hospitalShare: this.payment.amount * 0.95,
      governmentShare: this.payment.amount * 0.05,
      calculatedAt: new Date()
    };
    console.log(`💰 Remittance calculated: Hospital gets ₦${this.remittance.hospitalShare}, Government gets ₦${this.remittance.governmentShare}`);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);