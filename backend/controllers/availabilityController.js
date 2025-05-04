const ExaminerAvailability = require('../models/ExaminerAvailability');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to validate time format (HH:MM)
const isValidTimeFormat = (time) => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};

// Helper function to check for overlapping slots
const hasOverlappingSlots = (slots) => {
  // Sort slots by date and start time
  const sortedSlots = [...slots].sort((a, b) => {
    const dateCompare = new Date(a.date) - new Date(b.date);
    if (dateCompare !== 0) return dateCompare;
    
    return a.startTime.localeCompare(b.startTime);
  });

  // Check for overlaps
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const currentSlot = sortedSlots[i];
    const nextSlot = sortedSlots[i + 1];
    
    // If same date and current end time is after next start time
    if (
      currentSlot.date.toDateString() === nextSlot.date.toDateString() &&
      currentSlot.endTime > nextSlot.startTime
    ) {
      return true;
    }
  }
  
  return false;
};

// Create availability slots for an examiner
exports.createSlots = async (req, res) => {
  try {
    const { examinerId, slots } = req.body;
    
    // Validate examiner exists
    const examiner = await User.findById(examinerId);
    if (!examiner) {
      return res.status(404).json({ message: 'Examiner not found' });
    }
    
    // Validate and format slots
    const formattedSlots = slots.map(slot => {
      // Validate time format
      if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
        throw new Error('Invalid time format. Please use HH:MM format.');
      }
      
      // Ensure end time is after start time
      if (slot.startTime >= slot.endTime) {
        throw new Error('End time must be after start time');
      }

      // Parse and validate date
      const date = new Date(slot.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }

      // Process exam duty release if provided
      let examDutyRelease = undefined;
      if (slot.examDutyRelease && slot.examDutyRelease.isReleased) {
        if (!slot.examDutyRelease.reason) {
          throw new Error('Reason is required for exam duty release');
        }
        examDutyRelease = {
          isReleased: true,
          reason: slot.examDutyRelease.reason,
          approvalStatus: 'pending',
        };
      }

      return {
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status || 'available',
        notes: slot.notes || '',
        examDutyRelease
      };
    });
    
    // Check for overlapping slots
    if (hasOverlappingSlots(formattedSlots)) {
      return res.status(400).json({ 
        message: 'Overlapping slots detected. Please adjust your schedule.'
      });
    }
    
    // Find existing availability record or create new one
    let availability = await ExaminerAvailability.findOne({ examinerId });
    
    if (!availability) {
      availability = new ExaminerAvailability({
        examinerId,
        examinerName: examiner.fullName,
        slots: []
      });
    }
    
    // Add new slots
    availability.slots.push(...formattedSlots);
    availability.modifiedBy = req.user ? req.user._id : null;
    
    await availability.save();
    
    res.status(201).json(availability);
  } catch (error) {
    if (error.message.includes('Invalid time format') || 
        error.message.includes('End time must be after start time') ||
        error.message.includes('Invalid date format')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get availability for an examiner with optional date range filter
exports.getAvailability = async (req, res) => {
  try {
    const { examinerId } = req.params;
    const { startDate, endDate, status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { examinerId };
    const slotQuery = {};
    
    // Add date range filter if provided
    if (startDate || endDate) {
      slotQuery.date = {};
      if (startDate) slotQuery.date.$gte = new Date(startDate);
      if (endDate) slotQuery.date.$lte = new Date(endDate);
    }
    
    // Add status filter if provided
    if (status) {
      slotQuery.status = status;
    }
    
    // Find availability with filtered slots
    const availability = await ExaminerAvailability.findOne(query);
    
    if (!availability) {
      // Return empty result with pagination instead of 404
      return res.json({
        examinerId,
        examinerName: '',
        slots: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: 0
        }
      });
    }
    
    // Filter slots based on query
    let filteredSlots = availability.slots;
    
    if (Object.keys(slotQuery).length > 0) {
      filteredSlots = availability.slots.filter(slot => {
        let match = true;
        
        // Check date range
        if (slotQuery.date) {
          if (slotQuery.date.$gte && slot.date < slotQuery.date.$gte) match = false;
          if (slotQuery.date.$lte && slot.date > slotQuery.date.$lte) match = false;
        }
        
        // Check status
        if (slotQuery.status && slot.status !== slotQuery.status) match = false;
        
        return match;
      });
    }
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSlots = filteredSlots.slice(startIndex, endIndex);
    
    // Prepare response with pagination info
    const response = {
      examinerId: availability.examinerId,
      examinerName: availability.examinerName,
      slots: paginatedSlots,
      pagination: {
        total: filteredSlots.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredSlots.length / limit)
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific slot
exports.updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const updates = req.body;
    
    // Find availability record containing the slot
    const availability = await ExaminerAvailability.findOne({ 'slots._id': slotId });
    
    if (!availability) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    // Find the specific slot
    const slotIndex = availability.slots.findIndex(slot => slot._id.toString() === slotId);
    
    if (slotIndex === -1) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    // Validate time format if updating times
    if (updates.startTime && !isValidTimeFormat(updates.startTime)) {
      return res.status(400).json({ message: 'Invalid start time format' });
    }
    
    if (updates.endTime && !isValidTimeFormat(updates.endTime)) {
      return res.status(400).json({ message: 'Invalid end time format' });
    }
    
    // Ensure end time is after start time
    const newStartTime = updates.startTime || availability.slots[slotIndex].startTime;
    const newEndTime = updates.endTime || availability.slots[slotIndex].endTime;
    
    if (newStartTime >= newEndTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    
    // Update the slot
    Object.keys(updates).forEach(key => {
      availability.slots[slotIndex][key] = updates[key];
    });
    
    // Update modified information
    availability.modifiedBy = req.user ? req.user._id : null;
    
    await availability.save();
    
    res.json(availability.slots[slotIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle slot status
exports.toggleSlotStatus = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { newStatus } = req.body;
    
    // Validate status
    if (!['available', 'booked', 'unavailable'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find availability record containing the slot
    const availability = await ExaminerAvailability.findOne({ 'slots._id': slotId });
    
    if (!availability) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    // Find the specific slot
    const slotIndex = availability.slots.findIndex(slot => slot._id.toString() === slotId);
    
    if (slotIndex === -1) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    // Special handling for 'unavailable' state
    if (newStatus === 'unavailable' && availability.slots[slotIndex].status === 'booked') {
      // Add logic here for handling cancellation of booked slots if needed
      // For example, notify the student or update related presentation
    }
    
    // Update status
    availability.slots[slotIndex].status = newStatus;
    
    // Update modified information for audit trail
    availability.modifiedBy = req.user ? req.user._id : null;
    
    await availability.save();
    
    res.json(availability.slots[slotIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a slot
exports.deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    
    // Find availability record containing the slot
    const availability = await ExaminerAvailability.findOne({ 'slots._id': slotId });
    
    if (!availability) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    // Remove the slot from the array
    availability.slots = availability.slots.filter(slot => slot._id.toString() !== slotId);
    
    // Update modified information
    availability.modifiedBy = req.user ? req.user._id : null;
    
    await availability.save();
    
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate availability report
exports.generateAvailabilityReport = async (req, res) => {
  console.log('Report generation request received:', req.query);
  try {
    const { examinerId, startDate, endDate, format = 'pdf' } = req.query;
    console.log('Processing report with params:', { examinerId, startDate, endDate, format });
    
    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      console.log('Invalid date range:', { startDate, endDate });
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Build query
    const query = {};
    if (examinerId && examinerId !== 'undefined' && examinerId !== 'null') {
      try {
        query.examinerId = new mongoose.Types.ObjectId(examinerId);
        console.log('Using examiner filter:', query.examinerId);
      } catch (err) {
        console.error('Invalid examiner ID format:', examinerId, err);
        return res.status(400).json({ message: 'Invalid examiner ID format' });
      }
    }
    
    console.log('Executing query:', JSON.stringify(query));
    
    // Find availability records
    const availabilityRecords = await ExaminerAvailability.find(query);
    console.log(`Found ${availabilityRecords.length} availability records`);
    
    if (!availabilityRecords.length) {
      console.log('No availability records found');
      return res.status(200).json({ 
        message: 'No availability records found',
        data: []
      });
    }
    
    // Filter slots by date range
    console.log('Filtering slots by date range');
    const reportData = [];
    
    for (const record of availabilityRecords) {
      try {
        // Convert record to plain object to avoid mongoose document issues
        const plainRecord = JSON.parse(JSON.stringify(record));
        
        // Filter slots by date range if specified
        if (startDate || endDate) {
          const filteredSlots = [];
          
          for (const slot of plainRecord.slots || []) {
            try {
              const slotDate = new Date(slot.date);
              let matchesDateRange = true;
              
              if (startDate) {
                const startDateObj = new Date(startDate);
                if (slotDate < startDateObj) {
                  matchesDateRange = false;
                }
              }
              
              if (endDate) {
                const endDateObj = new Date(endDate);
                // Set end date to end of day
                endDateObj.setHours(23, 59, 59, 999);
                if (slotDate > endDateObj) {
                  matchesDateRange = false;
                }
              }
              
              if (matchesDateRange) {
                filteredSlots.push(slot);
              }
            } catch (slotError) {
              console.error('Error processing slot:', slot, slotError);
              // Skip this slot but continue processing others
            }
          }
          
          plainRecord.slots = filteredSlots;
        }
        
        if ((plainRecord.slots || []).length > 0) {
          reportData.push(plainRecord);
        }
      } catch (recordError) {
        console.error('Error processing record:', record._id, recordError);
        // Skip this record but continue processing others
      }
    }
    
    console.log(`After filtering, found ${reportData.length} records with ${reportData.reduce((acc, record) => acc + (record.slots?.length || 0), 0)} total slots`);
    
    if (reportData.length === 0) {
      console.log('No availability slots found for the specified date range');
      return res.status(200).json({ 
        message: 'No availability slots found for the specified date range',
        data: []
      });
    }
    
    // Generate response based on format
    if (format === 'pdf') {
      console.log('Returning data for PDF generation');
      // Return JSON data that will be converted to PDF on the frontend
      return res.json(reportData);
    } else {
      console.log('Returning JSON data');
      // Return JSON data directly
      return res.json(reportData);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ 
      message: 'Error generating report',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};