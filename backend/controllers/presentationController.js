const Presentation = require('../models/Presentation');

// Validation helper functions
const validatePresentation = (data) => {
  const errors = {};
  
  // Required fields validation
  if (!data.groupId || data.groupId.trim().length < 3) {
    errors.groupId = 'Group ID is required and must be at least 3 characters';
  }
  
  if (!data.examinerName || data.examinerName.trim().length < 3) {
    errors.examinerName = 'Examiner name is required and must be at least 3 characters';
  }
  
  if (!data.examinerEmail) {
    errors.examinerEmail = 'Examiner email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.examinerEmail)) {
    errors.examinerEmail = 'Invalid email format';
  }
  
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    // Check if date is in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for date comparison
    
    if (selectedDate < today) {
      errors.date = 'Cannot schedule presentations in the past';
    }
    
    // If date is today, check if time is in the past
    if (selectedDate.toDateString() === today.toDateString() && data.time) {
      const [hours, minutes] = data.time.split(':').map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);
      
      const currentTime = new Date();
      
      if (selectedTime < currentTime) {
        errors.time = 'Cannot schedule presentations in the past';
      }
    }
  }
  
  if (!data.time) {
    errors.time = 'Time is required';
  }
  
  if (!data.location) {
    errors.location = 'Location is required';
  }
  
  if (!data.duration) {
    errors.duration = 'Duration is required';
  } else if (data.duration <= 0) {
    errors.duration = 'Duration must be greater than 0';
  } else if (data.duration > 180) {
    errors.duration = 'Duration cannot exceed 3 hours (180 minutes)';
  }
  
  if (!data.subjectName || data.subjectName.trim().length < 3) {
    errors.subjectName = 'Subject name is required and must be at least 3 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

exports.getAllPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find();
    res.json(presentations);
  } catch (error) {
    console.error('Get Presentations Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPresentation = async (req, res) => {
  try {
    console.log('Creating presentation with data:', req.body);
    
    // Validate presentation data
    const validation = validatePresentation(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const presentation = new Presentation(req.body);
    const savedPresentation = await presentation.save();
    console.log('Saved presentation:', savedPresentation);
    res.json(savedPresentation);
  } catch (error) {
    console.error('Create Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePresentation = async (req, res) => {
  try {
    // Validate presentation data
    const validation = validatePresentation(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json(presentation);
  } catch (error) {
    console.error('Update Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findByIdAndDelete(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePresentationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const presentation = await Presentation.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    
    res.json(presentation);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: error.message });
  }
};