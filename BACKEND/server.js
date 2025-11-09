const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;


mongoose.connect(MONGOURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare Base API Running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/booking', require('./routes/bookingRoute'));
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin', require('./routes/adminRoute'));


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});