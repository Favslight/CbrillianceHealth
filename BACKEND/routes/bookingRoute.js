const express = require('express');
const Booking = require('../models/Booking');
const Patient = require('../models/Patient');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Demo data for hospitals and doctors (for MVP)
const demoHospitals = [
  { 
    name: "Jos University Teaching Hospital", 
    doctors: [
      { name: "Dr. John Musa", specialty: "Cardiology" },
      { name: "Dr. Grace Bala", specialty: "Pediatrics" },
      { name: "Dr. Michael Okoro", specialty: "Surgery" }
    ]
  },
  { 
    name: "Plateau Specialist Hospital", 
    doctors: [
      { name: "Dr. Ahmed Tukur", specialty: "Orthopedics" },
      { name: "Dr. Fatima Abdul", specialty: "Dermatology" },
      { name: "Dr. James Johnson", specialty: "Dentistry" }
    ]
  },
  { 
    name: "Bingham University Teaching Hospital", 
    doctors: [
      { name: "Dr. Sarah Chukwu", specialty: "Gynecology" },
      { name: "Dr. David Mark", specialty: "Ophthalmology" },
      { name: "Dr. Jennifer Okon", specialty: "Psychiatry" }
    ]
  }
];

// GET - Available hospitals and doctors
router.get('/hospitals', auth, (req, res) => {
  res.json({
    success: true,
    hospitals: demoHospitals
  });
});

// POST - Create new booking
router.post('/create', auth, async (req, res) => {
  try {
    const { hospitalName, doctorName, specialty, appointmentDate, timeSlot, purpose, consultationFee } = req.body;

    // Verify patient exists
    /*const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(400).json({ message: 'Patient profile not found' });
    }*/

    const booking = new Booking({
      patient: req.patient._id,
      hospitalName,
      doctorName,
      specialty,
      appointmentDate,
      timeSlot,
      purpose,
      payment: {
        amount: consultationFee,
        status: 'pending'
      }
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: {
        id: booking._id,
        hospitalName: booking.hospitalName,
        doctorName: booking.doctorName,
        appointmentDate: booking.appointmentDate,
        amount: booking.payment.amount,
        status: booking.status
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Booking creation failed', 
      error: error.message 
    });
  }
});

// POST - Simulate payment
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Simulate payment processing
    booking.payment.status = 'paid';
    booking.payment.method = 'card';
    booking.payment.transactionReference = `TXN${Date.now()}`;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    res.json({
      success: true,
      message: 'Payment successful!',
      booking: {
        id: booking._id,
        amount: booking.payment.amount,
        transactionReference: booking.payment.transactionReference,
        hospitalShare: booking.remittance.hospitalShare,
        governmentShare: booking.remittance.governmentShare
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Payment failed', 
      error: error.message 
    });
  }
});

// GET - Patient's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const bookings = await Booking.find({ patient: patient._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings', 
      error: error.message 
    });
  }
});

module.exports = router;