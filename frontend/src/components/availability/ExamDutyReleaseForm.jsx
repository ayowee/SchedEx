import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  Alert,
  AlertTitle
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Info as InfoIcon } from '@mui/icons-material';
import { format, isBefore, startOfDay } from 'date-fns';

const ExamDutyReleaseForm = ({ 
  enabled, 
  examinerId, 
  onFormDataChange, 
  errors = {},
  startDateMin,
  endDateMin
}) => {
  const [formData, setFormData] = useState({
    isReleased: false,
    startDate: null,
    endDate: null,
    reason: '',
    replacementLecturerId: ''
  });
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get current date for validation
  const today = startOfDay(new Date());

  // Fetch lecturers on component mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Reset form when enabled state changes
  useEffect(() => {
    if (!enabled) {
      resetForm();
    }
  }, [enabled]);

  // Notify parent component when form data changes
  useEffect(() => {
    if (enabled) {
      onFormDataChange(formData);
    }
  }, [formData, enabled, onFormDataChange]);

  // Fetch lecturers from API
  const fetchLecturers = async () => {
    setLoading(true);
    try {
      // Filter to only get lecturers
      const response = await fetch('http://localhost:5000/api/users?userType=Lecturer');
      const data = await response.json();
      setLecturers(data.filter(user => user._id !== examinerId)); // Exclude current examiner
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      isReleased: false,
      startDate: null,
      endDate: null,
      reason: '',
      replacementLecturerId: ''
    });
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          Exam Duty Release Form
          <Tooltip title="Request to be released from exam duty for this period">
            <InfoIcon fontSize="small" sx={{ ml: 1 }} />
          </Tooltip>
        </Typography>
      </Box>
      
      <Collapse in={enabled}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isReleased}
                  onChange={(e) => handleChange('isReleased', e.target.checked)}
                />
              }
              label="Request to be released from exam duty for this period"
            />
          </Grid>
          
          {formData.isReleased && (
            <>
              {/* Date Range Selection */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Release Start Date"
                    value={formData.startDate}
                    onChange={(newValue) => {
                      handleChange('startDate', newValue);
                      // If end date is before new start date, reset it
                      if (formData.endDate && newValue && isBefore(formData.endDate, newValue)) {
                        handleChange('endDate', null);
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
                    minDate={startDateMin || today}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Release End Date"
                    value={formData.endDate}
                    onChange={(newValue) => handleChange('endDate', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate || (formData.startDate ? 'End date must be after start date' : '')}
                      />
                    )}
                    minDate={formData.startDate || endDateMin || today}
                    disabled={!formData.startDate}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Reason Field */}
              <Grid item xs={12}>
                <TextField
                  label="Reason for Release Request"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  error={!!errors.reason}
                  helperText={errors.reason || 'Please provide a detailed reason for your release request'}
                  required
                />
              </Grid>
              
              {/* Replacement Lecturer Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.replacementLecturerId}>
                  <InputLabel>Replacement Lecturer</InputLabel>
                  <Select
                    value={formData.replacementLecturerId}
                    onChange={(e) => handleChange('replacementLecturerId', e.target.value)}
                    label="Replacement Lecturer"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {lecturers.map(lecturer => (
                      <MenuItem key={lecturer._id} value={lecturer._id}>
                        {lecturer.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.replacementLecturerId || 'Select a lecturer to replace you during this period'}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default ExamDutyReleaseForm;
