import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/exam-duty-release';

// Create a new exam duty release request
const createExamDutyRelease = async (releaseData) => {
  try {
    const response = await axios.post(API_URL, releaseData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating exam duty release:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get all exam duty release requests with optional filters
const getExamDutyReleases = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params: filters,
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exam duty releases:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get a specific exam duty release request
const getExamDutyRelease = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exam duty release:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update the status of an exam duty release request (for admin/approvers)
const updateExamDutyReleaseStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating exam duty release status:', error);
    throw error.response ? error.response.data : error;
  }
};

// Delete an exam duty release request (only if pending)
const deleteExamDutyRelease = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting exam duty release:', error);
    throw error.response ? error.response.data : error;
  }
};

const examDutyReleaseService = {
  createExamDutyRelease,
  getExamDutyReleases,
  getExamDutyRelease,
  updateExamDutyReleaseStatus,
  deleteExamDutyRelease
};

export default examDutyReleaseService;
