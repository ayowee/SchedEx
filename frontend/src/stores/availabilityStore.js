import { create } from 'zustand';
import { availabilityService } from '../services/availabilityService';

// Create a store for managing availability state
const useAvailabilityStore = create((set, get) => ({
  // State properties
  currentExaminer: null,
  slots: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  reportParams: {
    startDate: null,
    endDate: null,
    examinerIds: [],
    format: 'pdf'
  },
  loading: false,
  error: null,

  // Actions
  setCurrentExaminer: (examiner) => set({ currentExaminer: examiner }),
  
  // Fetch slots for an examiner with optional filters
  fetchSlots: async (examinerId, filters = {}) => {
    if (!examinerId) return;
    
    set({ loading: true, error: null });
    try {
      const response = await availabilityService.getAvailability(examinerId, filters);
      set({
        slots: response.slots || [],
        pagination: response.pagination || { page: 1, limit: 10, total: 0 },
        loading: false
      });
      return response;
    } catch (error) {
      console.error('Error fetching slots:', error);
      set({ 
        error: 'Failed to load availability slots. Please try again.',
        loading: false 
      });
      return { slots: [], pagination: { total: 0 } };
    }
  },
  
  // Create new availability slots
  createSlots: async (examinerId, slotData) => {
    set({ loading: true, error: null });
    try {
      const response = await availabilityService.createSlots(examinerId, slotData);
      // Refresh slots after creation
      get().fetchSlots(examinerId, { page: 1 });
      return response;
    } catch (error) {
      console.error('Error creating slots:', error);
      set({ 
        error: 'Failed to create availability slots. Please try again.',
        loading: false 
      });
      throw error;
    }
  },
  
  // Update a specific slot
  updateSlot: async (slotId, changes) => {
    set({ loading: true, error: null });
    try {
      const response = await availabilityService.updateSlot(slotId, changes);
      // Refresh slots after update
      const { currentExaminer } = get();
      if (currentExaminer) {
        get().fetchSlots(currentExaminer._id);
      }
      return response;
    } catch (error) {
      console.error('Error updating slot:', error);
      set({ 
        error: 'Failed to update slot. Please try again.',
        loading: false 
      });
      throw error;
    }
  },
  
  // Toggle slot status
  toggleSlotStatus: async (slotId, newStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await availabilityService.toggleSlotStatus(slotId, newStatus);
      // Refresh slots after status change
      const { currentExaminer } = get();
      if (currentExaminer) {
        get().fetchSlots(currentExaminer._id);
      }
      return response;
    } catch (error) {
      console.error('Error toggling slot status:', error);
      set({ 
        error: 'Failed to update slot status. Please try again.',
        loading: false 
      });
      throw error;
    }
  },
  
  // Generate availability report
  generateReport: async (params) => {
    set({ loading: true, error: null, reportParams: params });
    try {
      const response = await availabilityService.generateReport(params);
      set({ loading: false });
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      set({ 
        error: 'Failed to generate report. Please try again.',
        loading: false 
      });
      throw error;
    }
  },
  
  // Reset store state
  resetStore: () => set({
    slots: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    error: null
  })
}));

export default useAvailabilityStore;