import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api/availability';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Service for generating and handling reports
 */
const reportService = {
  /**
   * Generate an availability report
   * @param {Object} params - Report parameters
   * @param {string} params.examinerId - Optional examiner ID to filter by
   * @param {string} params.startDate - Optional start date (YYYY-MM-DD)
   * @param {string} params.endDate - Optional end date (YYYY-MM-DD)
   * @param {string} params.format - Report format (pdf or json)
   * @returns {Promise<Blob|Object>} - PDF blob or JSON data
   */
  generateAvailabilityReport: async (params) => {
    try {
      const { examinerId, startDate, endDate, format = 'pdf' } = params;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (examinerId) queryParams.append('examinerId', examinerId);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (format) queryParams.append('format', format);
      
      console.log('Sending report request with params:', queryParams.toString());
      
      // Fetch data from API
      const response = await axios.get(`${API_URL}/report?${queryParams.toString()}`, {
        headers: getAuthHeader(),
        timeout: 10000 // 10 second timeout
      });
      
      // Check if we got valid data
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.log('No data returned from API');
        throw new Error('No availability data found for the selected criteria');
      }
      
      // Return JSON data if requested
      if (format === 'json') {
        return response.data;
      }
      
      // Generate PDF report
      return reportService.generatePDF(response.data, params);
    } catch (error) {
      console.error('Error generating report:', error);
      // Add more context to the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        throw new Error(`Server error: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error;
      }
    }
  },
  
  /**
   * Generate a PDF report from availability data
   * @param {Array} data - Availability data
   * @param {Object} params - Report parameters
   * @returns {Blob} - PDF blob
   */
  generatePDF: (data, params) => {
    try {
      console.log('Generating PDF with data:', Array.isArray(data) ? `${data.length} records` : typeof data);
      const { examinerId, startDate, endDate } = params;
      
      // Validate data
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error('No data available to generate report');
      }
      
      // Ensure data is in the expected format
      const reportData = Array.isArray(data) ? data : [data];
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set document properties
      doc.setProperties({
        title: 'Examiner Availability Report',
        subject: 'Availability Schedule',
        author: 'SchedEx System',
        creator: 'SchedEx'
      });
      
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Examiner Availability Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add report metadata
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      
      // Add report generation date
      doc.text(`Report Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
      
      // Add filter information
      let filterText = 'Filters: ';
      if (examinerId) filterText += `Examiner ID: ${examinerId}, `;
      if (startDate) filterText += `From: ${startDate}, `;
      if (endDate) filterText += `To: ${endDate}, `;
      if (filterText === 'Filters: ') filterText += 'None';
      else filterText = filterText.slice(0, -2); // Remove trailing comma and space
      
      doc.text(filterText, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
      
      // Process data for the table
      let tableData = [];
      let totalSlots = 0;
      
      reportData.forEach(examiner => {
        try {
          if (examiner.slots && Array.isArray(examiner.slots) && examiner.slots.length > 0) {
            totalSlots += examiner.slots.length;
            
            examiner.slots.forEach(slot => {
              try {
                // Validate slot data
                if (!slot.date) {
                  console.warn('Slot missing date:', slot);
                  return; // Skip this slot
                }
                
                const slotDate = new Date(slot.date);
                if (isNaN(slotDate.getTime())) {
                  console.warn('Invalid slot date:', slot.date);
                  return; // Skip this slot
                }
                
                tableData.push([
                  examiner.examinerName || 'Unknown',
                  format(slotDate, 'MMM dd, yyyy'),
                  slot.startTime || 'N/A',
                  slot.endTime || 'N/A',
                  slot.status ? (slot.status.charAt(0).toUpperCase() + slot.status.slice(1)) : 'Unknown', // Capitalize status
                  slot.notes || '-'
                ]);
              } catch (slotError) {
                console.error('Error processing slot for PDF:', slot, slotError);
                // Skip this slot but continue processing others
              }
            });
          }
        } catch (examinerError) {
          console.error('Error processing examiner for PDF:', examiner, examinerError);
          // Skip this examiner but continue processing others
        }
      });
      
      // Add total count
      doc.text(`Total Slots: ${totalSlots}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
      
      // Define table headers
      const headers = [['Examiner', 'Date', 'Start Time', 'End Time', 'Status', 'Notes']];
      
      // If no data, add a message
      if (tableData.length === 0) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('No availability data found for the selected criteria.', doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });
        // Return the PDF as a blob even with no data
        return doc.output('blob');
      }
      
      // Generate table
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185], // Blue color
          textColor: 255, // White
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240] // Light gray for alternate rows
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Examiner
          1: { cellWidth: 25 }, // Date
          2: { cellWidth: 20 }, // Start Time
          3: { cellWidth: 20 }, // End Time
          4: { cellWidth: 20 }, // Status
          5: { cellWidth: 'auto' } // Notes
        },
        didDrawPage: (data) => {
          // Add page number at the bottom
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
          
          // Add footer
          doc.text(
            'Generated by SchedEx Availability Management System',
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 5,
            { align: 'center' }
          );
        }
      });
      
      console.log('PDF generation completed successfully');
      // Return the PDF as a blob
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF report: ${error.message}`);
    }
  }
};

export default reportService;
