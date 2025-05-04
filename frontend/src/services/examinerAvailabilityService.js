import api from './api';

// Service for handling examiner availability
const examinerAvailabilityService = {
    // Check if an examiner is available at a specific date and time range
    checkAvailability: async (examinerId, date, startTime, endTime) => {
        try {
            // Format date as YYYY-MM-DD for the API
            const formattedDate = date instanceof Date 
                ? date.toISOString().split('T')[0]
                : date;

            // Make API call to check availability
            const response = await api.get('/availability/check', {
                params: {
                    examinerId,
                    date: formattedDate,
                    startTime,
                    endTime
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error checking examiner availability:', error);
            // If API fails, assume unavailable to be safe
            return { available: false, conflict: true };
        }
    },

    // Get all availability slots for an examiner
    getExaminerAvailability: async (examinerId) => {
        try {
            const response = await api.get(`/availability/${examinerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching examiner availability:', error);
            throw error;
        }
    }
};

export default examinerAvailabilityService;
