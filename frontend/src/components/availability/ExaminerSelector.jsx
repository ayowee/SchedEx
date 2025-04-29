import React from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';

const ExaminerSelector = ({ examiners, selectedExaminer, onExaminerChange }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Examiner
      </Typography>
      <Autocomplete
        value={selectedExaminer}
        onChange={(event, newValue) => onExaminerChange(newValue)}
        options={examiners}
        getOptionLabel={(option) => option.fullName}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Examiner"
            variant="outlined"
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box key={option._id} component="li" {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1">{option.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {option.email}
              </Typography>
            </Box>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option._id === value?._id}
        sx={{ width: '100%' }}
      />
    </Box>
  );
};

export default ExaminerSelector; 