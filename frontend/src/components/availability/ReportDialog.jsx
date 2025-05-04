import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  PictureAsPdf as PdfIcon,
  Code as JsonIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format, isValid, isBefore, startOfDay } from 'date-fns';

const ReportDialog = ({ open, onClose, onGenerateReport, examiners }) => {
  const [selectedExaminer, setSelectedExaminer] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current date for validation
  const today = startOfDay(new Date());

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedExaminer('');
      setStartDate(null);
      setEndDate(null);
      setReportFormat('pdf');
      setError(null);
    }
  }, [open]);

  const validateForm = () => {
    // Clear previous errors
    setError(null);
    
    // Validate date range if both dates are provided
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      if (isBefore(endDate, startDate)) {
        setError('End date must be after start date');
        return false;
      }
    }
    
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsGenerating(true);
    try {
      const params = {
        examinerId: selectedExaminer,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        format: reportFormat
      };

      await onGenerateReport(params);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isGenerating ? undefined : onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="report-dialog-title"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle id="report-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Generate Availability Report</Typography>
          {!isGenerating && (
            <IconButton onClick={onClose} color="inherit" size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
            Report Parameters
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">Examiner Selection</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="examiner-select-label">Select Examiner</InputLabel>
                <Select
                  labelId="examiner-select-label"
                  value={selectedExaminer}
                  onChange={(e) => setSelectedExaminer(e.target.value)}
                  label="Select Examiner"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                >
                  <MenuItem value="">All Examiners</MenuItem>
                  {examiners.map((examiner) => (
                    <MenuItem key={examiner._id} value={examiner._id}>
                      {examiner.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">Date Range</Typography>
                <Tooltip title="Leave dates empty to include all available dates">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                        // If end date is before new start date, reset it
                        if (endDate && newValue && isBefore(endDate, newValue)) {
                          setEndDate(null);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          helperText="Optional" 
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          helperText="Optional" 
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      )}
                      minDate={startDate}
                      disabled={!startDate} // Disable until start date is selected
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight="medium">Report Format</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    flex: 1, 
                    cursor: 'pointer',
                    bgcolor: reportFormat === 'pdf' ? 'primary.50' : 'background.paper',
                    borderColor: reportFormat === 'pdf' ? 'primary.main' : 'divider',
                    borderWidth: reportFormat === 'pdf' ? 2 : 1
                  }}
                  onClick={() => setReportFormat('pdf')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <PdfIcon color={reportFormat === 'pdf' ? 'primary' : 'action'} sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2" fontWeight={reportFormat === 'pdf' ? 'bold' : 'normal'} color={reportFormat === 'pdf' ? 'primary.main' : 'text.primary'}>
                      PDF Format
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    flex: 1, 
                    cursor: 'pointer',
                    bgcolor: reportFormat === 'json' ? 'primary.50' : 'background.paper',
                    borderColor: reportFormat === 'json' ? 'primary.main' : 'divider',
                    borderWidth: reportFormat === 'json' ? 2 : 1
                  }}
                  onClick={() => setReportFormat('json')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <JsonIcon color={reportFormat === 'json' ? 'primary' : 'action'} sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2" fontWeight={reportFormat === 'json' ? 'bold' : 'normal'} color={reportFormat === 'json' ? 'primary.main' : 'text.primary'}>
                      JSON Format
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          disabled={isGenerating}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          variant="contained" 
          color="primary"
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;