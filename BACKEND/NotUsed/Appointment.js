/*

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  hospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true 
  },
  localGovt: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LocalGovernment' 
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  timeSlot: {
    start: String,
    end: String
  },
  purpose: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  // PAYMENT & REMITTANCE FIELDS
  payment: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: String, // 'card', 'transfer', 'cash'
    transactionReference: String,
    paidAt: Date
  },
  // 95%/5% SPLIT CALCULATION
  remittance: {
    hospitalShare: Number,    // 95% of payment
    governmentShare: Number,  // 5% of payment
    calculatedAt: Date
  },
  notes: String
}, {
  timestamps: true
});

// Calculate 95%/5% split before saving if payment is completed
appointmentSchema.pre('save', function(next) {
  if (this.payment.status === 'paid' && this.payment.amount && !this.remittance.calculatedAt) {
    this.remittance = {
      hospitalShare: this.payment.amount * 0.95,
      governmentShare: this.payment.amount * 0.05,
      calculatedAt: new Date()
    };
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);

*/