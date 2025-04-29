import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Presentation API services
export const presentationService = {
  // Get all presentations
  getAllPresentations: async () => {
    try {
      const response = await api.get('/presentations');
      return response.data;
    } catch (error) {
      console.error('Error fetching presentations:', error);
      throw error;
    }
  },

  // Get a single presentation by ID
  getPresentationById: async (id) => {
    try {
      const response = await api.get(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching presentation ${id}:`, error);
      throw error;
    }
  },

  // Create a new presentation
  createPresentation: async (presentationData) => {
    try {
      const response = await api.post('/presentations', presentationData);
      return response.data;
    } catch (error) {
      console.error('Error creating presentation:', error);
      throw error;
    }
  },

  // Update an existing presentation
  updatePresentation: async (id, presentationData) => {
    try {
      const response = await api.put(`/presentations/${id}`, presentationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating presentation ${id}:`, error);
      throw error;
    }
  },

  // Delete a presentation
  deletePresentation: async (id) => {
    try {
      const response = await api.delete(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting presentation ${id}:`, error);
      throw error;
    }
  },

  // Update presentation status
  updatePresentationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/presentations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating presentation status ${id}:`, error);
      throw error;
    }
  }
};

// Activity API services
export const activityService = {
  // Get all activities
  getAllActivities: async () => {
    try {
      const response = await api.get('/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }
};

// User API services
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
};

export default api;
