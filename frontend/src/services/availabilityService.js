import axios from 'axios';

const API_URL = 'http://localhost:5000/api/availability';

// Availability API services
const availabilityService = {
  // Create availability slots
  createSlots: async (examinerId, slots) => {
    try {
      const response = await axios.post(API_URL, { examinerId, slots });
      return response.data;
    } catch (error) {
      console.error('Error creating availability slots:', error);
      throw error;
    }
  },

  // Get availability for an examiner
  getAvailability: async (examinerId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await axios.get(`${API_URL}/${examinerId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // Update a specific slot
  updateSlot: async (slotId, updates) => {
    try {
      const response = await axios.patch(`${API_URL}/slots/${slotId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating slot:', error);
      throw error;
    }
  },

  // Toggle slot status
  toggleSlotStatus: async (slotId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/status/${slotId}`, { newStatus });
      return response.data;
    } catch (error) {
      console.error('Error toggling slot status:', error);
      throw error;
    }
  },

  // Delete a slot
  deleteSlot: async (slotId) => {
    try {
      const response = await axios.delete(`${API_URL}/slots/${slotId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  },

  // Generate availability report
  generateReport: async (params) => {
    try {
      const { examinerId, startDate, endDate, format } = params;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (examinerId) queryParams.append('examinerId', examinerId);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (format) queryParams.append('format', format);

      const response = await axios.get(`${API_URL}/report?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};

export default availabilityService;