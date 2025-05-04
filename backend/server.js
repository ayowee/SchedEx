require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/presentations', require('./routes/presentationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/exam-duty-release', require('./routes/examDutyReleaseRoutes'));
app.get('/api/test', (_req, res) => res.send('API is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));