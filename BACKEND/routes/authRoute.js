const express = require('express');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Patient Registration - SIMPLIFIED
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender, 
      address 
    } = req.body;

    // Check if patient already exists
    let patient = await Patient.findOne({ email });
    if (patient) {
      return res.status(400).json({ message: 'Patient with this email already exists' });
    }

    // Create patient (password auto-hashed by pre-save hook)
    patient = new Patient({
      email,
      password, // Will be auto-hashed
      personalInfo: {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        address
      },
      medicalInfo: {
        bloodGroup: '',
        allergies: [],
        chronicConditions: [],
        medications: []
      }
    });
    await patient.save();

    // Create JWT token
    const token = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully!',
      token,
      patient: {
        id: patient._id,
        email: patient.email,
        name: `${firstName} ${lastName}`,
        phone: phone
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Patient Login - SIMPLIFIED
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check patient exists
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      patient: {
        id: patient._id,
        email: patient.email,
        name: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
        phone: patient.personalInfo.phone
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: error.message 
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // The JWT token will be managed by the frontend

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        id: patient._id,
        email: patient.email,
        personalInfo: patient.personalInfo,
        medicalInfo: patient.medicalInfo,
        createdAt: patient.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyConact,
      bloodGroup,
      allergies,
      chronicConditions,
      medications
    } = req.body;

    const patient = await Patient.findById(req.patient._id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Update personal info if provided
    if (firstName) patient.personalInfo.firstName = firstName;
    if (lastName) patient.personalInfo.lastName = lastName;
    if (phone) patient.personalInfo.phone = phone;
    if (dateOfBirth) patient.personalInfo.dateOfBirth = dateOfBirth;
    if (gender) patient.personalInfo.gender = gender;
    if (address) patient.personalInfo.address = address;
    if (emergencyContact) patient.personalInfo.emergencyContact = emergencyContact;

    // Update medical info if provided
    if (bloodGroup) patient.medicalInfo.bloodGroup = bloodGroup;
    if (allergies) patient.medicalInfo.allergies = allergies;
    if (chronicConditions) patient.medicalInfo.chronicConditions = chronicConditions;
    if (medications) patient.medicalInfo.medications = medications;

    await patient.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: patient._id,
        email: patient.email,
        personalInfo: patient.personalInfo,
        medicalInfo: patient.medicalInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }
})

router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const patient = await Patient.findById(req.patient._id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Verify current password
    const isMatch = await patient.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    patient.password = newPassword;
    await patient.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

module.exports = router;