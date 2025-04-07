import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch, FormControlLabel, TextField, MenuItem, Button, Box } from '@mui/material';
import { toast } from 'react-hot-toast';

const INITIAL_SLOTS = [
  {
    examiner: {
      id: 'EX001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '0771234567'
    },
    module: {
      moduleId: 'MOD001',
      name: 'Software Engineering',
      specialization: 'SE',
      semester: '1'
    },
    sessions: [
      {
        name: 'Final Viva',
        type: 'viva',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Room 101',
        deliveryMethod: 'offline',
        date: '2024-03-20',
        isActive: true
      },
      {
        name: 'Project Presentation',
        type: 'presentation',
        startTime: '14:00',
        endTime: '15:00',
        location: 'Room 102',
        deliveryMethod: 'online',
        date: '2024-03-21',
        isActive: false
      }
    ]
  },
  {
    examiner: {
      id: 'EX002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      mobile: '0761234567'
    },
    module: {
      moduleId: 'MOD002',
      name: 'Database Management',
      specialization: 'SE',
      semester: '2'
    },
    sessions: [
      {
        name: 'Database Design Review',
        type: 'review',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Room 201',
        deliveryMethod: 'offline',
        date: '2024-03-22',
        isActive: true
      }
    ]
  },
  {
    examiner: {
      id: 'EX003',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      mobile: '0751234567'
    },
    module: {
      moduleId: 'MOD003',
      name: 'Web Development',
      specialization: 'SE',
      semester: '3'
    },
    sessions: [
      {
        name: 'Frontend Development Demo',
        type: 'demo',
        startTime: '11:00',
        endTime: '12:00',
        location: 'Room 301',
        deliveryMethod: 'online',
        date: '2024-03-23',
        isActive: true
      },
      {
        name: 'Backend Integration Review',
        type: 'review',
        startTime: '14:00',
        endTime: '15:00',
        location: 'Room 302',
        deliveryMethod: 'offline',
        date: '2024-03-24',
        isActive: false
      }
    ]
  }
];

const SlotTable = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    sessionType: '',
    moduleId: ''
  });
  const [reportData, setReportData] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSlots = localStorage.getItem('slots');
    if (savedSlots) {
      try {
        const parsed = JSON.parse(savedSlots);
        setSlots(Array.isArray(parsed) ? parsed : INITIAL_SLOTS);
      } catch (error) {
        console.error('Error loading slots:', error);
        setSlots(INITIAL_SLOTS);
      }
    }
  }, []);

  // Save data to localStorage whenever slots change
  useEffect(() => {
    localStorage.setItem('slots', JSON.stringify(slots));
  }, [slots]);

  // Handle toggle switch
  const handleToggle = (slotIndex, sessionIndex) => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotIndex].sessions[sessionIndex].isActive = 
        !newSlots[slotIndex].sessions[sessionIndex].isActive;
      localStorage.setItem('slots', JSON.stringify(newSlots));
      return newSlots;
    });
  };

  // Handle delete
  const handleDelete = (slotIndex, sessionIndex) => {
    const slot = slots[slotIndex];
    const session = slot.sessions[sessionIndex];
    
    if (window.confirm(`Are you sure you want to delete the session "${session.name}" for ${slot.examiner.name}?`)) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        // Remove only the specific session
        newSlots[slotIndex].sessions = newSlots[slotIndex].sessions.filter((_, index) => index !== sessionIndex);
        
        // If no sessions left in this slot, remove the entire slot
        if (newSlots[slotIndex].sessions.length === 0) {
          newSlots.splice(slotIndex, 1);
        }
        
        localStorage.setItem('slots', JSON.stringify(newSlots));
        toast.success('Session deleted successfully');
        return newSlots;
      });
    }
  };

  // Handle edit
  const handleEdit = (slotIndex) => {
    const slotData = slots[slotIndex];
    navigate('/create-slot', { 
      state: { 
        slotData,
        slotIndex,
        editMode: true
      } 
    });
  };

  // Filter slots based on search query
  const filteredSlots = slots.filter(slot => {
    const searchLower = searchQuery.toLowerCase();
    return (
      slot.examiner.name.toLowerCase().includes(searchLower) ||
      slot.examiner.id.toLowerCase().includes(searchLower) ||
      slot.module.name.toLowerCase().includes(searchLower) ||
      slot.module.moduleId.toLowerCase().includes(searchLower)
    );
  });

  // Get unique session types
  const sessionTypes = [...new Set(slots.flatMap(slot => 
    slot.sessions.map(session => session.type)
  ))];

  // Get unique modules
  const modules = [...new Set(slots.map(slot => ({
    id: slot.module.moduleId,
    name: slot.module.name
  })))];

  // Generate report
  const generateReport = () => {
    let filteredData = [...slots];

    // Apply date range filter
    if (reportFilters.startDate && reportFilters.endDate) {
      filteredData = filteredData.map(slot => ({
        ...slot,
        sessions: slot.sessions.filter(session => 
          session.date >= reportFilters.startDate && 
          session.date <= reportFilters.endDate
        )
      })).filter(slot => slot.sessions.length > 0);
    }

    // Apply session type filter
    if (reportFilters.sessionType) {
      filteredData = filteredData.map(slot => ({
        ...slot,
        sessions: slot.sessions.filter(session => 
          session.type === reportFilters.sessionType
        )
      })).filter(slot => slot.sessions.length > 0);
    }

    // Apply module filter
    if (reportFilters.moduleId) {
      filteredData = filteredData.filter(slot => 
        slot.module.moduleId === reportFilters.moduleId
      );
    }

    // Calculate report statistics
    const statistics = {
      totalSessions: filteredData.reduce((acc, slot) => acc + slot.sessions.length, 0),
      activeSessions: filteredData.reduce((acc, slot) => 
        acc + slot.sessions.filter(s => s.isActive).length, 0
      ),
      onlineSessions: filteredData.reduce((acc, slot) => 
        acc + slot.sessions.filter(s => s.deliveryMethod === 'online').length, 0
      ),
      offlineSessions: filteredData.reduce((acc, slot) => 
        acc + slot.sessions.filter(s => s.deliveryMethod === 'offline').length, 0
      )
    };

    setReportData({
      filteredSlots: filteredData,
      statistics
    });

    toast.success('Report generated successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-black">Slot Management</h3>
        <button
          onClick={() => navigate('/create-slot')}
          className="bg-black text-green-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create New Slot
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search slots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Examiner
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredSlots.map((slot, slotIndex) => (
              slot.sessions.map((session, sessionIndex) => (
                <tr key={`${slotIndex}-${sessionIndex}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{slot.examiner.name}</div>
                    <div className="text-sm text-gray-500">{slot.examiner.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{slot.module.name}</div>
                    <div className="text-sm text-gray-500">{slot.module.moduleId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.name}</div>
                    <div className="text-sm text-gray-500">{session.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.date}</div>
                    <div className="text-sm text-gray-500">{session.startTime} - {session.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.location}</div>
                    <div className="text-sm text-gray-500">{session.deliveryMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={session.isActive}
                          onChange={() => handleToggle(slotIndex, sessionIndex)}
                          color="success"
                          size="small"
                        />
                      }
                      label={session.isActive ? 'Active' : 'Inactive'}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          color: session.isActive ? '#16a34a' : '#6b7280'
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(slotIndex)}
                      className="text-indigo-300 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slotIndex, sessionIndex)}
                      className="text-red-300 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Generation Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-black mb-4">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TextField
            label="Start Date"
            type="date"
            value={reportFilters.startDate}
            onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={reportFilters.endDate}
            onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            select
            label="Session Type"
            value={reportFilters.sessionType}
            onChange={(e) => setReportFilters(prev => ({ ...prev, sessionType: e.target.value }))}
            fullWidth
          >
            <MenuItem value="">All Types</MenuItem>
            {sessionTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Module"
            value={reportFilters.moduleId}
            onChange={(e) => setReportFilters(prev => ({ ...prev, moduleId: e.target.value }))}
            fullWidth
          >
            <MenuItem value="">All Modules</MenuItem>
            {modules.map(module => (
              <MenuItem key={module.id} value={module.id}>{module.name}</MenuItem>
            ))}
          </TextField>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={generateReport}
          className="bg-black text-white hover:bg-gray-800"
        >
          Generate Report
        </Button>

        {/* Report Results */}
        {reportData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Report Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-black">{reportData.statistics.totalSessions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-black">{reportData.statistics.activeSessions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Online Sessions</p>
                <p className="text-2xl font-bold text-black">{reportData.statistics.onlineSessions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Offline Sessions</p>
                <p className="text-2xl font-bold text-black">{reportData.statistics.offlineSessions}</p>
              </div>
            </div>

            {/* Filtered Sessions Table */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Filtered Sessions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {reportData.filteredSlots.map((slot, slotIndex) => (
                      slot.sessions.map((session, sessionIndex) => (
                        <tr key={`${slotIndex}-${sessionIndex}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{session.date}</div>
                            <div className="text-sm text-gray-500">{session.startTime} - {session.endTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{session.name}</div>
                            <div className="text-sm text-gray-500">{session.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              session.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {session.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotTable; 