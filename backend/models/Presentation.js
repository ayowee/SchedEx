const mongoose = require('mongoose');
const PresentationSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  examinerId: { type: String },
  examinerName: { type: String, required: true },
  examinerEmail: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true, default: 30 },
  location: { type: String, required: true },
  subjectName: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Presentation', PresentationSchema);
