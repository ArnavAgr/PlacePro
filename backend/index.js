const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve resume files

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the PlacePro Backend!');
});

// TODO: add application & offers routes later
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend listening on', PORT));
