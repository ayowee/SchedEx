const ExamDutyRelease = require('../models/ExamDutyRelease');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new exam duty release request
exports.createExamDutyRelease = async (req, res) => {
  try {
    const { 
      examinerId, 
      startDate, 
      endDate, 
      reason, 
      replacementLecturerId 
    } = req.body;
    
    // Validate examiner exists
    const examiner = await User.findById(examinerId);
    if (!examiner) {
      return res.status(404).json({ message: 'Examiner not found' });
    }
    
    // Validate replacement lecturer if provided
    let replacementLecturer = null;
    if (replacementLecturerId) {
      replacementLecturer = await User.findById(replacementLecturerId);
      if (!replacementLecturer) {
        return res.status(404).json({ message: 'Replacement lecturer not found' });
      }
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (start > end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Create new release request
    const releaseRequest = new ExamDutyRelease({
      examinerId,
      examinerName: examiner.fullName,
      startDate: start,
      endDate: end,
      reason,
      replacementLecturerId: replacementLecturer ? replacementLecturer._id : null,
      replacementLecturerName: replacementLecturer ? replacementLecturer.fullName : null,
      status: 'pending'
    });
    
    await releaseRequest.save();
    
    res.status(201).json(releaseRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exam duty release requests with optional filters
exports.getExamDutyReleases = async (req, res) => {
  try {
    const { examinerId, status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (examinerId) query.examinerId = examinerId;
    if (status) query.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get releases with pagination
    const releases = await ExamDutyRelease.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await ExamDutyRelease.countDocuments(query);
    
    res.json({
      releases,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific exam duty release request
exports.getExamDutyRelease = async (req, res) => {
  try {
    const { id } = req.params;
    
    const release = await ExamDutyRelease.findById(id);
    
    if (!release) {
      return res.status(404).json({ message: 'Exam duty release request not found' });
    }
    
    res.json(release);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the status of an exam duty release request (for admin/approvers)
exports.updateExamDutyReleaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const release = await ExamDutyRelease.findById(id);
    
    if (!release) {
      return res.status(404).json({ message: 'Exam duty release request not found' });
    }
    
    // Update status
    release.status = status;
    
    // Add approval info if approved or rejected
    if (status === 'approved' || status === 'rejected') {
      release.approvedBy = req.user ? req.user._id : null;
      release.approvalDate = new Date();
    }
    
    release.modifiedAt = new Date();
    
    await release.save();
    
    res.json(release);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an exam duty release request (only if pending)
exports.deleteExamDutyRelease = async (req, res) => {
  try {
    const { id } = req.params;
    
    const release = await ExamDutyRelease.findById(id);
    
    if (!release) {
      return res.status(404).json({ message: 'Exam duty release request not found' });
    }
    
    // Only allow deletion of pending requests
    if (release.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete a request that has already been approved or rejected' 
      });
    }
    
    await release.remove();
    
    res.json({ message: 'Exam duty release request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
