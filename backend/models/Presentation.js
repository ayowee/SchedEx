const mongoose = require('mongoose');
const PresentationSchema = new mongoose.Schema({
  title: String,
  student: String, // could be studentId if you want to relate to User
  examiner: String, // could be examinerId
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  scheduledDate: Date,
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Presentation', PresentationSchema);
