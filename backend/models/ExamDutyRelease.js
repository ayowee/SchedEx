const mongoose = require('mongoose');

const ExamDutyReleaseSchema = new mongoose.Schema({
  examinerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  examinerName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  replacementLecturerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  replacementLecturerName: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvalDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
});

// Create index on examinerId and status
ExamDutyReleaseSchema.index({ examinerId: 1, status: 1 });

module.exports = mongoose.model('ExamDutyRelease', ExamDutyReleaseSchema);
