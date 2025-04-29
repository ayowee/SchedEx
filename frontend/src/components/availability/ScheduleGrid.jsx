import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ScheduleGrid = ({ 
  examinerId, 
  onUpdateSlot, 
  onToggleStatus, 
  onDeleteSlot,
  fetchSlots 
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0
  });
  const [editingSlot, setEditingSlot] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Load slots when component mounts or filters change
  useEffect(() => {
    if (examinerId) {
      loadSlots();
    }
  }, [examinerId, filters, pagination.page, pagination.limit]);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const { startDate, endDate, status } = filters;
      const { page, limit } = pagination;
      
      const filterParams = {
        page: page + 1, // API uses 1-based pagination
        limit,
        status
      };
      
      if (startDate) filterParams.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) filterParams.endDate = format(endDate, 'yyyy-MM-dd');
      
      const response = await fetchSlots(examinerId, filterParams);
      
      setSlots(response.slots || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0
      }));
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 0 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleLimitChange = (event) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0 // Reset to first page when limit changes
    }));
  };

  const handleEditClick = (slot) => {
    setEditingSlot(slot._id);
    setEditValues({
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  };

  const handleEditCancel = () => {
    setEditingSlot(null);
    setEditValues({});
  };

  const handleEditSave = async () => {
    if (!editingSlot) return;
    
    try {
      await onUpdateSlot(editingSlot, editValues);
      setEditingSlot(null);
      setEditValues({});
      loadSlots(); // Reload slots after update
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await onToggleStatus(slotId, newStatus);
      loadSlots(); // Reload slots after status change
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleDeleteClick = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await onDeleteSlot(slotId);
        loadSlots(); // Reload slots after deletion
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'available':
        return <Chip label="Available" color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'booked':
        return <Chip label="Booked" color="primary" size="small" icon={<CheckCircleIcon />} />;
      case 'unavailable':
        return <Chip label="Unavailable" color="error" size="small" icon={<BlockIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Availability Schedule" 
        action={
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => loadSlots()}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
        }
      />
      <Divider />
      <CardContent>
        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={filters.startDate}
                  onChange={(newValue) => handleFilterChange('startDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={filters.endDate}
                  onChange={(newValue) => handleFilterChange('endDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="booked">Booked</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Slots Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time Range</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : slots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No slots found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                slots.map((slot) => (
                  <TableRow key={slot._id}>
                    <TableCell>
                      {format(new Date(slot.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {editingSlot === slot._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            type="time"
                            value={editValues.startTime}
                            onChange={(e) => handleEditChange('startTime', e.target.value)}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                          />
                          <Typography sx={{ lineHeight: '40px' }}>to</Typography>
                          <TextField
                            type="time"
                            value={editValues.endTime}
                            onChange={(e) => handleEditChange('endTime', e.target.value)}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                          />
                        </Box>
                      ) : (
                        `${slot.startTime} to ${slot.endTime}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSlot === slot._id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editValues.status || slot.status}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                          >
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="booked">Booked</MenuItem>
                            <MenuItem value="unavailable">Unavailable</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusChip(slot.status)}
                          <Box sx={{ ml: 1 }}>
                            <IconButton 
                              size="small" 
                              color="success" 
                              onClick={() => handleStatusChange(slot._id, 'available')}
                              disabled={slot.status === 'available'}
                            >
                              <Tooltip title="Mark as Available">
                                <CheckCircleIcon fontSize="small" />
                              </Tooltip>
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleStatusChange(slot._id, 'booked')}
                              disabled={slot.status === 'booked'}
                            >
                              <Tooltip title="Mark as Booked">
                                <CheckCircleIcon fontSize="small" />
                              </Tooltip>
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleStatusChange(slot._id, 'unavailable')}
                              disabled={slot.status === 'unavailable'}
                            >
                              <Tooltip title="Mark as Unavailable">
                                <BlockIcon fontSize="small" />
                              </Tooltip>
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editingSlot === slot._id ? (
                        <>
                          <IconButton color="primary" onClick={handleEditSave} size="small">
                            <Tooltip title="Save">
                              <CheckCircleIcon fontSize="small" />
                            </Tooltip>
                          </IconButton>
                          <IconButton color="error" onClick={handleEditCancel} size="small">
                            <Tooltip title="Cancel">
                              <CancelIcon fontSize="small" />
                            </Tooltip>
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton color="primary" onClick={() => handleEditClick(slot)} size="small">
                            <Tooltip title="Edit">
                              <EditIcon fontSize="small" />
                            </Tooltip>
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteClick(slot._id)} size="small">
                            <Tooltip title="Delete">
                              <DeleteIcon fontSize="small" />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleGrid;