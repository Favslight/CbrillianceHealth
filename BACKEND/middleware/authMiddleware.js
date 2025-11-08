const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.patient = await Patient.findById(decoded.id);
    
    if (!req.patient) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;