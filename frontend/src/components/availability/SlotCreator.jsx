import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Checkbox,
  Collapse,
  Divider, 
  FormControl, 
  FormControlLabel, 
  FormHelperText, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Paper,
  Radio, 
  RadioGroup, 
  Select, 
  TextField, 
  Tooltip,
  Typography,
  Alert,
  AlertTitle,
  Switch
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Info as InfoIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { format, addDays, addWeeks, addMonths, isValid, parseISO, isSameDay, isBefore, startOfDay } from 'date-fns';
import ExamDutyReleaseForm from './ExamDutyReleaseForm';

const SlotCreator = ({ examinerId, onSlotsCreated }) => {
  const [patternType, setPatternType] = useState('single');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeBlocks, setTimeBlocks] = useState([{ startTime: '', endTime: '', notes: '' }]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [showExamDutyRelease, setShowExamDutyRelease] = useState(false);
  const [examDutyReleaseFormData, setExamDutyReleaseFormData] = useState({
    isReleased: false,
    startDate: null,
    endDate: null,
    reason: '',
    replacementLecturerId: ''
  });
  const [formMode, setFormMode] = useState('timeSlots'); // 'timeSlots' or 'examDutyRelease'
  
  // Get current date for date picker validation
  const today = startOfDay(new Date());

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
    setTimeBlocks([{ startTime: '', endTime: '', notes: '' }]);
    setErrors({});
    setWarnings([]);
    setPreview([]);
    setShowExamDutyRelease(false);
    setExamDutyReleaseFormData({
      isReleased: false,
      startDate: null,
      endDate: null,
      reason: '',
      replacementLecturerId: ''
    });
    setFormMode('timeSlots');
  };
  
  // Check for overlapping time blocks on the same day
  const checkOverlappingTimeBlocks = (slots) => {
    const overlaps = [];
    
    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      const dateStr = format(new Date(slot.date), 'yyyy-MM-dd');
      if (!slotsByDate[dateStr]) {
        slotsByDate[dateStr] = [];
      }
      slotsByDate[dateStr].push(slot);
    });
    
    // Check for overlaps within each date group
    Object.keys(slotsByDate).forEach(dateStr => {
      const dateSlots = slotsByDate[dateStr];
      if (dateSlots.length > 1) {
        // Sort by start time
        dateSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        // Check for overlaps
        for (let i = 0; i < dateSlots.length - 1; i++) {
          const current = dateSlots[i];
          const next = dateSlots[i + 1];
          
          if (current.endTime > next.startTime) {
            overlaps.push({
              date: dateStr,
              slot1: `${current.startTime}-${current.endTime}`,
              slot2: `${next.startTime}-${next.endTime}`
            });
          }
        }
      }
    });
    
    return overlaps;
  };

  const handlePatternChange = (event) => {
    setPatternType(event.target.value);
    setPreview([]);
  };

  const handleAddTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { startTime: '', endTime: '', notes: '' }]);
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
    const newWarnings = [];

    // Validate date range
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (isBefore(startDate, today)) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    if (patternType !== 'single' && !endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate) {
      if (isBefore(endDate, startDate)) {
        newErrors.endDate = 'End date must be after start date';
      } else if (isBefore(endDate, today)) {
        newErrors.endDate = 'End date cannot be in the past';
      }
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
    
    // Validate exam duty release form if enabled
    if (formMode === 'examDutyRelease' && examDutyReleaseFormData.isReleased) {
      if (!examDutyReleaseFormData.startDate) {
        newErrors.examDutyReleaseStartDate = 'Start date is required';
      } else if (isBefore(examDutyReleaseFormData.startDate, today)) {
        newErrors.examDutyReleaseStartDate = 'Start date cannot be in the past';
      }
      
      if (!examDutyReleaseFormData.endDate) {
        newErrors.examDutyReleaseEndDate = 'End date is required';
      } else if (examDutyReleaseFormData.startDate && isBefore(examDutyReleaseFormData.endDate, examDutyReleaseFormData.startDate)) {
        newErrors.examDutyReleaseEndDate = 'End date must be after start date';
      }
      
      if (!examDutyReleaseFormData.reason.trim()) {
        newErrors.examDutyReleaseReason = 'Reason is required for exam duty release';
      }
      
      if (!examDutyReleaseFormData.replacementLecturerId) {
        newErrors.replacementLecturerId = 'Replacement lecturer is required';
      }
    }
    
    // Generate preview slots to check for overlaps
    if (Object.keys(newErrors).length === 0) {
      let previewSlots = [];
      let currentDate = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : currentDate;
      
      if (currentDate) {
        // Generate dates based on pattern
        while (currentDate <= end) {
          timeBlocks.forEach(block => {
            if (block.startTime && block.endTime) {
              previewSlots.push({
                date: new Date(currentDate),
                startTime: block.startTime,
                endTime: block.endTime
              });
            }
          });

          // Increment date based on pattern
          if (patternType === 'daily') {
            currentDate = addDays(currentDate, 1);
          } else if (patternType === 'weekly') {
            currentDate = addWeeks(currentDate, 1);
          } else if (patternType === 'monthly') {
            currentDate = addMonths(currentDate, 1);
          } else {
            // For single pattern, break after one iteration
            break;
          }
        }
        
        // Check for overlapping time blocks
        const overlaps = checkOverlappingTimeBlocks(previewSlots);
        if (overlaps.length > 0) {
          overlaps.forEach(overlap => {
            newWarnings.push(`Overlapping time slots on ${overlap.date}: ${overlap.slot1} and ${overlap.slot2}`);
          });
        }
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    return Object.keys(newErrors).length === 0;
  };

  const generatePreview = () => {
    if (!validateForm()) {
      setPreview([]);
      return;
    }

    const slots = [];
    let currentDate = new Date(startDate);
    const end = patternType === 'single' ? currentDate : new Date(endDate);

    // Generate dates based on pattern
    while (currentDate <= end) {
      timeBlocks.forEach(block => {
        slots.push({
          date: new Date(currentDate),
          startTime: block.startTime,
          endTime: block.endTime,
          status: 'available',
          notes: block.notes || ''
        });
      });

      // Increment date based on pattern
      if (patternType === 'daily') {
        currentDate = addDays(currentDate, 1);
      } else if (patternType === 'weekly') {
        currentDate = addWeeks(currentDate, 1);
      } else if (patternType === 'monthly') {
        currentDate = addMonths(currentDate, 1);
      } else {
        // For single pattern, break after one iteration
        break;
      }
    }

    setPreview(slots);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (formMode === 'timeSlots') {
        // Generate slots if not already generated
        if (preview.length === 0) {
          generatePreview();
          setIsSubmitting(false);
          return;
        }
        
        // Check if there are warnings and confirm with user
        if (warnings.length > 0 && !window.confirm(
          `Warning: ${warnings.join('\n')}\n\nDo you want to continue anyway?`
        )) {
          setIsSubmitting(false);
          return;
        }

        // Format slots for API
        const formattedSlots = preview.map(slot => ({
          date: format(slot.date, 'yyyy-MM-dd'),
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status,
          notes: slot.notes || ''
        }));

        // Call the onSlotsCreated callback with the examinerId and slots
        await onSlotsCreated(examinerId, formattedSlots);
      } else if (formMode === 'examDutyRelease') {
        // Format exam duty release request for API
        const releaseRequest = {
          examinerId,
          startDate: format(examDutyReleaseFormData.startDate, 'yyyy-MM-dd'),
          endDate: format(examDutyReleaseFormData.endDate, 'yyyy-MM-dd'),
          reason: examDutyReleaseFormData.reason,
          replacementLecturerId: examDutyReleaseFormData.replacementLecturerId
        };

        // Import and use the examDutyReleaseService
        const examDutyReleaseService = (await import('../../services/examDutyReleaseService')).default;
        await examDutyReleaseService.createExamDutyRelease(releaseRequest);
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        submit: `Failed to ${formMode === 'timeSlots' ? 'create slots' : 'submit exam duty release request'}. Please try again.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form mode toggle
  const handleFormModeChange = (event) => {
    setFormMode(event.target.checked ? 'examDutyRelease' : 'timeSlots');
    setErrors({});
    setWarnings([]);
    setPreview([]);
  };
  
  // Handle exam duty release form data changes
  const handleExamDutyReleaseFormDataChange = (data) => {
    setExamDutyReleaseFormData(data);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
      <CardHeader 
        title={formMode === 'timeSlots' ? 'Create Availability Slots' : 'Exam Duty Release Request'}
        titleTypographyProps={{ variant: 'h5', fontWeight: 'bold', color: 'primary.main' }}
        action={
          <FormControlLabel
            control={
              <Switch
                checked={formMode === 'examDutyRelease'}
                onChange={handleFormModeChange}
                color="primary"
              />
            }
            label={<Typography sx={{ fontWeight: 'medium' }}>Exam Duty Release</Typography>}
            sx={{ mr: 1 }}
          />
        }
        sx={{ bgcolor: 'background.paper', pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {formMode === 'timeSlots' && (
              <>
                {/* Pattern Selection */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <FormControl component="fieldset" fullWidth>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                        Availability Pattern
                      </Typography>
                      <RadioGroup
                        row
                        name="patternType"
                        value={patternType}
                        onChange={handlePatternChange}
                        sx={{ width: '100%', justifyContent: 'space-between' }}
                      >
                        <FormControlLabel 
                          value="single" 
                          control={<Radio color="primary" />} 
                          label={<Typography sx={{ fontWeight: patternType === 'single' ? 'bold' : 'normal' }}>Single Day</Typography>} 
                          sx={{ flex: 1, m: 0 }}
                        />
                        <FormControlLabel 
                          value="daily" 
                          control={<Radio color="primary" />} 
                          label={<Typography sx={{ fontWeight: patternType === 'daily' ? 'bold' : 'normal' }}>Daily</Typography>} 
                          sx={{ flex: 1, m: 0 }}
                        />
                        <FormControlLabel 
                          value="weekly" 
                          control={<Radio color="primary" />} 
                          label={<Typography sx={{ fontWeight: patternType === 'weekly' ? 'bold' : 'normal' }}>Weekly</Typography>} 
                          sx={{ flex: 1, m: 0 }}
                        />
                        <FormControlLabel 
                          value="monthly" 
                          control={<Radio color="primary" />} 
                          label={<Typography sx={{ fontWeight: patternType === 'monthly' ? 'bold' : 'normal' }}>Monthly</Typography>} 
                          sx={{ flex: 1, m: 0 }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>
              </>
            )}

            {formMode === 'timeSlots' && (
              <>
                {/* Date Selection for Time Slots */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      Date Selection
                    </Typography>
                    <Grid container spacing={3}>
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
                              
                              // If end date is before new start date, reset it
                              if (endDate && newValue && isBefore(endDate, newValue)) {
                                setEndDate(null);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                              />
                            )}
                            minDate={today} // Prevent selecting past dates
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
                                  helperText={errors.endDate || (startDate ? 'End date must be after start date' : '')}
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                />
                              )}
                              minDate={startDate || today} // Prevent selecting dates before start date or today
                              disabled={!startDate} // Disable until start date is selected
                            />
                          </LocalizationProvider>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Time Blocks */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                        Time Blocks
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddTimeBlock}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                      >
                        Add Time Block
                      </Button>
                    </Box>
                    <Box sx={{ maxHeight: timeBlocks.length > 3 ? '300px' : 'auto', overflowY: 'auto', pr: 1 }}>
                      {timeBlocks.map((block, index) => (
                        <Paper 
                          key={index} 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 2, 
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative'
                          }}
                        >
                          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleRemoveTimeBlock(index)}
                              disabled={timeBlocks.length === 1}
                              sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Time Block {index + 1}
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
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
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
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
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Notes (Optional)"
                                value={block.notes || ''}
                                onChange={(e) => handleTimeBlockChange(index, 'notes', e.target.value)}
                                fullWidth
                                placeholder="Any special notes"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </>
            )}
            
            {/* Exam Duty Release Form */}
            {formMode === 'examDutyRelease' && (
              <Grid item xs={12}>
                <ExamDutyReleaseForm
                  enabled={true}
                  examinerId={examinerId}
                  onFormDataChange={handleExamDutyReleaseFormDataChange}
                  errors={{
                    startDate: errors.examDutyReleaseStartDate,
                    endDate: errors.examDutyReleaseEndDate,
                    reason: errors.examDutyReleaseReason,
                    replacementLecturerId: errors.replacementLecturerId
                  }}
                  startDateMin={today}
                  endDateMin={today}
                />
              </Grid>
            )}

            {/* Preview Section */}
            {preview.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      Preview ({preview.length} slots)
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPreview([])}
                      sx={{ borderRadius: 2 }}
                    >
                      Reset Preview
                    </Button>
                  </Box>
                  <Box 
                    sx={{ 
                      maxHeight: 250, 
                      overflowY: 'auto', 
                      p: 2, 
                      bgcolor: 'grey.50', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Grid container spacing={1}>
                      {preview.slice(0, 15).map((slot, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1, 
                              mb: 1, 
                              bgcolor: 'white',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              '&:hover': { boxShadow: 1 }
                            }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(slot.date), 'MMM dd, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {slot.startTime} to {slot.endTime}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    {preview.length > 15 && (
                      <Box sx={{ mt: 1, p: 1, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          ...and {preview.length - 15} more slots
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            )}

            {errors.submit && (
              <Grid item xs={12}>
                <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {errors.submit}
                </Alert>
              </Grid>
            )}

            {/* Warnings Section - Only show for time slots mode */}
            {formMode === 'timeSlots' && warnings.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.light', borderRadius: 2, boxShadow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.dark">Warning</Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {warnings.map((warning, index) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" color="warning.dark">{warning}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{ 
                      minWidth: '250px', 
                      borderRadius: 2,
                      py: 1.5,
                      boxShadow: 3,
                      '&:hover': { boxShadow: 5 }
                    }}
                    startIcon={formMode === 'timeSlots' && preview.length === 0 ? <AddIcon /> : null}
                  >
                    {formMode === 'timeSlots' 
                      ? (preview.length === 0 ? 'Generate Preview' : 'Create Slots')
                      : 'Submit Exam Duty Release Request'
                    }
                  </Button>
                  {formMode === 'timeSlots' && preview.length > 0 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setPreview([])}
                      sx={{ borderRadius: 2, mt: 2 }}
                    >
                      Reset Preview
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SlotCreator;