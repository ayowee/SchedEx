require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/presentations', require('./routes/presentationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
