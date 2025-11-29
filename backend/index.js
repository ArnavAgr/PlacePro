const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const studentRoutes = require('./routes/students');
const applicationRoutes = require('./routes/applications');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve resume files

const offerRoutes = require('./routes/offers');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reports', reportRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend listening on', PORT));
