const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: "HH:MM"
  endTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'booked', 'unavailable'],
    default: 'available'
  }
});

const ExaminerAvailabilitySchema = new mongoose.Schema({
  examinerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  examinerName: { type: String, required: true },
  slots: [SlotSchema],
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

// Create compound index on examinerId and slots.date
ExaminerAvailabilitySchema.index({ examinerId: 1, 'slots.date': 1 });

// Create single field index on slots.status
ExaminerAvailabilitySchema.index({ 'slots.status': 1 });

module.exports = mongoose.model('ExaminerAvailability', ExaminerAvailabilitySchema);