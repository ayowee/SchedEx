import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import CustomScheduler from '../Calendar/CustomScheduler';

const MainLayout = ({
  schedulerRef,
  setSchedulerRef,
  selectedColor,
  currentView,
  setCurrentView
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar
        currentView={currentView}
        schedulerRef={schedulerRef}
      />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <CustomScheduler
          getSchedulerRef={setSchedulerRef}
          selectedColor={selectedColor}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </Box>
    </Box>
  );
};

export default MainLayout; 