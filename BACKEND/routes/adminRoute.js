const express = require('express');
const Booking = require('../models/Booking');
const Patient = require('../models/Patient');
const adminAuth = require('../middleware/adminMiddleware')
const router = express.Router();

// GET - Dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    const recentBookings = await Booking.find()
      .populate('patient', 'personalInfo')
      .sort({ createdAt: -1 })
      .limit(10);

    const revenue = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      dashboard: {
        totalBookings,
        totalPatients,
        completedBookings,
        totalRevenue: revenue,
        governmentRevenue: revenue * 0.05, // 5% government share
        hospitalRevenue: revenue * 0.95,   // 95% hospital share
        recentBookings
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard data', 
      error: error.message 
    });
  }
});

// GET - All bookings with filters
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, hospital, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (hospital) filter.hospitalName = new RegExp(hospital, 'i');

    const bookings = await Booking.find(filter)
      .populate('patient', 'personalInfo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings', 
      error: error.message 
    });
  }
});

// GET - Financial report (remittance tracking)
router.get('/financial-report', adminAuth, async (req, res) => {
  try {
    const financialData = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $group: {
          _id: {
            hospital: '$hospitalName',
            month: { $month: '$payment.paidAt' },
            year: { $year: '$payment.paidAt' }
          },
          totalAmount: { $sum: '$payment.amount' },
          hospitalShare: { $sum: '$remittance.hospitalShare' },
          governmentShare: { $sum: '$remittance.governmentShare' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      success: true,
      financialReport: financialData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error generating financial report', 
      error: error.message 
    });
  }
});

module.exports = router;