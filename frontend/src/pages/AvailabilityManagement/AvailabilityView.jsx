import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

import SlotCreator from '../../components/availability/SlotCreator';
import ScheduleGrid from '../../components/availability/ScheduleGrid';
import ReportDialog from '../../components/availability/ReportDialog';
import ExaminerSelector from '../../components/availability/ExaminerSelector';
import AdminLayout from '../../layouts/AdminLayout';

import availabilityService from '../../services/availabilityService';

const AvailabilityView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [examiners, setExaminers] = useState([]);
  const [selectedExaminer, setSelectedExaminer] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load examiners when component mounts
  useEffect(() => {
    fetchExaminers();
  }, []);

  const fetchExaminers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
      
      const examinersList = users.filter(user => user.userType === 'Examiner');
      setExaminers(examinersList);
      
      if (examinersList.length > 0 && !selectedExaminer) {
        setSelectedExaminer(examinersList[0]);
      }
    } catch (err) {
      console.error('Error fetching examiners:', err);
      setError('Failed to load examiners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExaminerChange = (examiner) => {
    setSelectedExaminer(examiner);
  };

  const handleCreateSlots = async (examinerId, slots) => {
    try {
      await availabilityService.createSlots(examinerId, slots);
      setSuccessMessage('Availability slots created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error('Error creating slots:', error);
      setError('Failed to create availability slots. Please try again.');
      return false;
    }
  };

  const handleUpdateSlot = async (slotId, updates) => {
    try {
      await availabilityService.updateSlot(slotId, updates);
      setSuccessMessage('Slot updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error('Error updating slot:', error);
      setError('Failed to update slot. Please try again.');
      return false;
    }
  };

  const handleToggleStatus = async (slotId, newStatus) => {
    try {
      await availabilityService.toggleSlotStatus(slotId, newStatus);
      setSuccessMessage('Slot status updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error('Error toggling slot status:', error);
      setError('Failed to update slot status. Please try again.');
      return false;
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await availabilityService.deleteSlot(slotId);
      setSuccessMessage('Slot deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error('Error deleting slot:', error);
      setError('Failed to delete slot. Please try again.');
      return false;
    }
  };

  const handleGenerateReport = async (params) => {
    try {
      const report = await availabilityService.generateReport(params);
      
      // Create a download link for the report
      const blob = new Blob([report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `availability-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Report generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      return false;
    }
  };

  const fetchSlots = async (examinerId, filters) => {
    try {
      return await availabilityService.getAvailability(examinerId, filters);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Failed to load availability slots. Please try again.');
      return { slots: [], pagination: { total: 0 } };
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Examiner Availability Management | SchedEx</title>
      </Helmet>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              {/* Error and Success Messages */}
              {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Manage Availability" />
                  <Tab label="Create Slots" />
                </Tabs>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ReportIcon />}
                  onClick={() => setReportDialogOpen(true)}
                >
                  Generate Report
                </Button>
              </Box>
              
              {/* Examiner Selection */}
              <ExaminerSelector
                examiners={examiners}
                selectedExaminer={selectedExaminer}
                onExaminerChange={handleExaminerChange}
              />
              
              {/* Tab Content */}
              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <ScheduleGrid
                    examinerId={selectedExaminer?._id}
                    onUpdateSlot={handleUpdateSlot}
                    onToggleStatus={handleToggleStatus}
                    onDeleteSlot={handleDeleteSlot}
                    fetchSlots={fetchSlots}
                  />
                )}
                
                {activeTab === 1 && (
                  <SlotCreator
                    examinerId={selectedExaminer?._id}
                    onSlotsCreated={handleCreateSlots}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onGenerateReport={handleGenerateReport}
        examiners={examiners}
      />
    </AdminLayout>
  );
};

export default AvailabilityView;