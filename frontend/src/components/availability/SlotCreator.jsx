import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  FormHelperText, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Radio, 
  RadioGroup, 
  Select, 
  TextField, 
  Typography 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format, addDays, addWeeks, addMonths, isValid, parseISO } from 'date-fns';

const SlotCreator = ({ examinerId, onSlotsCreated }) => {
  const [patternType, setPatternType] = useState('single');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeBlocks, setTimeBlocks] = useState([{ startTime: '', endTime: '' }]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when examinerId changes
  useEffect(() => {
    resetForm();
  }, [examinerId]);

  // Generate preview when form values change
  useEffect(() => {
    if (patternType !== 'single' && startDate && endDate && timeBlocks.length > 0) {
      generatePreview();
    }
  }, [patternType, startDate, endDate, timeBlocks]);

  const resetForm = () => {
    setPatternType('single');
    setStartDate(null);
    setEndDate(null);
    setTimeBlocks([{ startTime: '', endTime: '' }]);
    setErrors({});
    setPreview([]);
  };

  const handlePatternChange = (event) => {
    setPatternType(event.target.value);
    setPreview([]);
  };

  const handleAddTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { startTime: '', endTime: '' }]);
  };

  const handleRemoveTimeBlock = (index) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks.splice(index, 1);
    setTimeBlocks(updatedBlocks);
  };

  const handleTimeBlockChange = (index, field, value) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index][field] = value;
    setTimeBlocks(updatedBlocks);

    // Clear error for this field if exists
    if (errors[`timeBlocks.${index}.${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`timeBlocks.${index}.${field}`];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate date range
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (patternType !== 'single' && !endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Validate time blocks
    timeBlocks.forEach((block, index) => {
      if (!block.startTime) {
        newErrors[`timeBlocks.${index}.startTime`] = 'Start time is required';
      }

      if (!block.endTime) {
        newErrors[`timeBlocks.${index}.endTime`] = 'End time is required';
      }

      if (block.startTime && block.endTime && block.startTime >= block.endTime) {
        newErrors[`timeBlocks.${index}.endTime`] = 'End time must be after start time';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePreview = () => {
    if (!validateForm()) {
      setPreview([]);
      return;
    }

    const slots = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    // Generate dates based on pattern
    while (currentDate <= end) {
      timeBlocks.forEach(block => {
        slots.push({
          date: new Date(currentDate),
          startTime: block.startTime,
          endTime: block.endTime,
          status: 'available'
        });
      });

      // Increment date based on pattern
      if (patternType === 'daily') {
        currentDate = addDays(currentDate, 1);
      } else if (patternType === 'weekly') {
        currentDate = addWeeks(currentDate, 1);
      } else if (patternType === 'monthly') {
        currentDate = addMonths(currentDate, 1);
      }
    }

    // For single pattern, just use the start date
    if (patternType === 'single') {
      timeBlocks.forEach(block => {
        slots.push({
          date: new Date(startDate),
          startTime: block.startTime,
          endTime: block.endTime,
          status: 'available'
        });
      });
    }

    setPreview(slots);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Generate slots if not already generated
    if (preview.length === 0) {
      generatePreview();
      return;
    }

    setIsSubmitting(true);

    try {
      // Format slots for API
      const formattedSlots = preview.map(slot => ({
        date: format(slot.date, 'yyyy-MM-dd'),
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status
      }));

      // Call the onSlotsCreated callback with the examinerId and slots
      await onSlotsCreated(examinerId, formattedSlots);
      resetForm();
    } catch (error) {
      console.error('Error creating slots:', error);
      setErrors({ submit: 'Failed to create slots. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Create Availability Slots" />
      <Divider />
      <CardContent>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {/* Pattern Selection */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>
                  Availability Pattern
                </Typography>
                <RadioGroup
                  row
                  name="patternType"
                  value={patternType}
                  onChange={handlePatternChange}
                >
                  <FormControlLabel value="single" control={<Radio />} label="Single Day" />
                  <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                  <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                  <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Date Selection */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    if (errors.startDate) {
                      const { startDate, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {patternType !== 'single' && (
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                      if (errors.endDate) {
                        const { endDate, ...rest } = errors;
                        setErrors(rest);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            )}

            {/* Time Blocks */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Time Blocks
              </Typography>
              {timeBlocks.map((block, index) => (
                <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={5}>
                    <TextField
                      label="Start Time"
                      type="time"
                      value={block.startTime}
                      onChange={(e) => handleTimeBlockChange(index, 'startTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      fullWidth
                      error={!!errors[`timeBlocks.${index}.startTime`]}
                      helperText={errors[`timeBlocks.${index}.startTime`]}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="End Time"
                      type="time"
                      value={block.endTime}
                      onChange={(e) => handleTimeBlockChange(index, 'endTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      fullWidth
                      error={!!errors[`timeBlocks.${index}.endTime`]}
                      helperText={errors[`timeBlocks.${index}.endTime`]}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTimeBlock(index)}
                      disabled={timeBlocks.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddTimeBlock}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Time Block
              </Button>
            </Grid>

            {/* Preview Section */}
            {preview.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Preview ({preview.length} slots)
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: 'auto', p: 2, bgcolor: 'background.paper' }}>
                  {preview.slice(0, 10).map((slot, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {format(new Date(slot.date), 'MMM dd, yyyy')} - {slot.startTime} to {slot.endTime}
                      </Typography>
                    </Box>
                  ))}
                  {preview.length > 10 && (
                    <Typography variant="body2" color="text.secondary">
                      ...and {preview.length - 10} more slots
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error">{errors.submit}</Typography>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {preview.length === 0 ? 'Generate Preview' : 'Create Slots'}
              </Button>
              {preview.length > 0 && (
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={() => setPreview([])}
                >
                  Reset Preview
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SlotCreator;