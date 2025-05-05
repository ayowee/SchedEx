import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import SchedExLogo from '../../assets/Logo.png';
import Modal from '../../components/ui/modal';
import PresentationForm from '../../components/forms/PresentationForm';
import './calendar-styles.css';
import { presentationService } from '../../services/api';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import DateNavigator from '../../components/presentationManagement/Calendar/DateNavigator';
// Service imported for future implementation - using mock data for now
// eslint-disable-next-line no-unused-vars
import examinerAvailabilityService from '../../services/examinerAvailabilityService';

// Status configuration with colors
const statusConfig = {
    'scheduled': {
        color: '#3B82F6', // Blue
        textColor: '#1E3A8A',
        backgroundColor: '#EFF6FF',
        gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        lightText: '#1E40AF',
        darkText: '#1E3A8A',
        borderColor: '#93C5FD'
    },
    'completed': {
        color: '#10B981', // Green
        textColor: '#064E3B',
        backgroundColor: '#ECFDF5',
        gradient: 'linear-gradient(135deg, #10B981, #059669)',
        lightText: '#065F46',
        darkText: '#064E3B',
        borderColor: '#6EE7B7'
    },
    'canceled': {
        color: '#EF4444', // Red
        textColor: '#7F1D1D',
        backgroundColor: '#FEF2F2',
        gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
        lightText: '#991B1B',
        darkText: '#7F1D1D',
        borderColor: '#FCA5A5'
    },
    'confirmed': {
        color: '#8B5CF6', // Purple
        textColor: '#4C1D95',
        backgroundColor: '#F5F3FF',
        gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        lightText: '#5B21B6',
        darkText: '#4C1D95',
        borderColor: '#C4B5FD'
    }
};

// Convert presentation data to calendar event format
const presentationToEvent = (presentation) => {
    try {
        // Handle different date formats
        let dateTime;
        if (presentation.date && presentation.time) {
            // Try to parse the date and time
            try {
                // Format: YYYY-MM-DD and HH:MM
                dateTime = new Date(`${presentation.date}T${presentation.time}`);
                
                // Check if the date is valid
                if (isNaN(dateTime.getTime())) {
                    console.error('Invalid date/time format:', presentation.date, presentation.time);
                    return null;
                }
            } catch (error) {
                console.error('Error parsing date/time:', error, presentation);
                return null;
            }
        } else if (presentation.startTime) {
            // Some APIs might provide a startTime directly
            dateTime = new Date(presentation.startTime);
            if (isNaN(dateTime.getTime())) {
                console.error('Invalid startTime:', presentation.startTime);
                return null;
            }
        } else {
            console.error('Missing date/time information:', presentation);
            return null;
        }

        // Calculate end time
        const duration = presentation.duration || 30; // Default to 30 minutes if not specified
        const endDateTime = new Date(dateTime.getTime() + duration * 60000);

        // Get status and ensure it's lowercase for consistency
        const status = (presentation.status || 'scheduled').toLowerCase();
        // Handle both spellings of canceled/cancelled
        const normalizedStatus = status === 'cancelled' ? 'canceled' : status;

        // Create the event object
        return {
            id: presentation.id || presentation._id, // Handle MongoDB _id
            title: presentation.subjectName || presentation.subject || 'Untitled',
            start: dateTime,
            end: endDateTime,
            groupId: presentation.groupId || '',
            location: presentation.location || '',
            backgroundColor: statusConfig[normalizedStatus]?.color || '#64748B',
            borderColor: statusConfig[normalizedStatus]?.color || '#64748B',
            textColor: '#FFFFFF',
            extendedProps: {
                examinerName: presentation.examinerName || presentation.examiner || '',
                examinerEmail: presentation.examinerEmail || '',
                examinerId: presentation.examinerId || presentation.examiner_id || '',
                description: presentation.description || '',
                status: normalizedStatus,
                duration: duration,
                groupId: presentation.groupId || '',
                location: presentation.location || ''
            }
        };
    } catch (error) {
        console.error('Error converting presentation to event:', error, presentation);
        return null;
    }
};

// Convert calendar event to presentation format
const eventToPresentation = (event) => {
    const startDate = event.start;
    // Format status - ensure it's included and properly cased
    const status = event.extendedProps.status 
        ? event.extendedProps.status.charAt(0).toUpperCase() + event.extendedProps.status.slice(1).toLowerCase() 
        : 'Scheduled';

    return {
        id: event.id,
        _id: event.id, // Include both id and _id to handle MongoDB ID
        groupId: event.extendedProps.groupId || event.groupId,
        examinerId: event.extendedProps.examinerId,
        examinerName: event.extendedProps.examinerName,
        examinerEmail: event.extendedProps.examinerEmail,
        date: startDate.toISOString().split('T')[0],
        time: startDate.toTimeString().substring(0, 5),
        duration: event.extendedProps.duration || 30,
        location: event.extendedProps.location || event.location,
        subjectName: event.extendedProps.subjectName || event.title,
        description: event.extendedProps.description || '',
        status: status
    };
};

const Calendar = () => {
    // Initial data - this would typically come from an API or parent component
    const initialPresentations = useMemo(() => [
        {
            id: 1,
            groupId: "CS-01",
            examinerId: "EX-101",
            date: "2025-10-15",
            time: "10:00",
            location: "CS Lab 1",
            duration: 30,
            examinerName: "Dr. Smith",
            examinerEmail: "smith@university.edu",
            subjectName: "Advanced Algorithms",
            description: "Final project presentation",
            status: "scheduled"
        },
        {
            id: 2,
            groupId: "CS-02",
            examinerId: "EX-102",
            date: "2025-10-16",
            time: "14:00",
            location: "CS Lab 2",
            duration: 45,
            examinerName: "Dr. Johnson",
            examinerEmail: "johnson@university.edu",
            subjectName: "Database Systems",
            description: "Research paper presentation",
            status: "completed"
        },
        {
            id: 3,
            groupId: "CS-03",
            examinerId: "EX-103",
            date: "2025-10-17",
            time: "11:30",
            location: "CS Lab 3",
            duration: 40,
            examinerName: "Dr. Williams",
            examinerEmail: "williams@university.edu",
            subjectName: "Machine Learning",
            description: "Project demonstration",
            status: "canceled"
        },
        {
            id: 4,
            groupId: "CS-04",
            examinerId: "EX-104",
            date: "2025-10-18",
            time: "09:00",
            location: "CS Lab 1",
            duration: 35,
            examinerName: "Dr. Brown",
            examinerEmail: "brown@university.edu",
            subjectName: "Web Development",
            description: "Final project presentation",
            status: "scheduled"
        }
    ], []);

    // State management
    const [presentations, setPresentations] = useState(initialPresentations);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPresentation, setSelectedPresentation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [examinerAvailabilityData, setExaminerAvailabilityData] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [draggedEvent, setDraggedEvent] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [availabilityConflict, setAvailabilityConflict] = useState(false);
    const [highlightedDate, setHighlightedDate] = useState(null);

    const calendarRef = useRef(null);
    const [calendarApi, setCalendarApi] = useState(null);

    // Fetch presentations from API
    const fetchPresentations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await presentationService.getAllPresentations();
            console.log('API Response - Presentations:', data);
            
            // Check if data is in the expected format
            if (data && Array.isArray(data)) {
                setPresentations(data);
                
                // Map presentations to events and log each conversion
                const mappedEvents = data.map(presentation => {
                    const event = presentationToEvent(presentation);
                    console.log('Converting presentation to event:', { 
                        presentation, 
                        event,
                        dateValid: presentation.date && typeof presentation.date === 'string',
                        timeValid: presentation.time && typeof presentation.time === 'string',
                        statusValid: presentation.status && statusConfig[(presentation.status || '').toLowerCase()]
                    });
                    return event;
                }).filter(event => event !== null); // Filter out null events
                
                console.log('Valid Mapped Events:', mappedEvents);
                
                if (mappedEvents.length === 0) {
                    console.warn('No valid events were created from the presentations data');
                    
                    // If no events were created, let's try to create events from the mock data
                    const mockEvents = initialPresentations.map(presentationToEvent).filter(event => event !== null);
                    console.log('Using mock events as fallback:', mockEvents);
                    setEvents(mockEvents);
                } else {
                    setEvents(mappedEvents);
                }
            } else {
                console.error('Invalid presentation data format:', data);
                toast.error('Invalid data format received from server');
                
                // Fallback to mock data
                const mockEvents = initialPresentations.map(presentationToEvent).filter(event => event !== null);
                console.log('Using mock events as fallback due to invalid data:', mockEvents);
                setEvents(mockEvents);
            }
        } catch (error) {
            console.error('Error fetching presentations:', error);
            toast.error('Failed to load presentations');
            
            // Fallback to mock data
            const mockEvents = initialPresentations.map(presentationToEvent).filter(event => event !== null);
            console.log('Using mock events as fallback due to error:', mockEvents);
            setEvents(mockEvents);
        } finally {
            setIsLoading(false);
        }
    }, [initialPresentations]); // Add initialPresentations to the dependency array

    // Fetch examiner availability
    const fetchExaminerAvailability = useCallback(async () => {
        try {
            // This would be replaced with an actual API call
            // const data = await examinerAvailabilityService.getAllAvailability();
            // For now, we'll use a mock implementation
            const mockAvailability = {
                'EX-101': [
                    { date: '2025-10-15', startTime: '09:00', endTime: '12:00' },
                    { date: '2025-10-16', startTime: '14:00', endTime: '17:00' },
                ],
                'EX-102': [
                    { date: '2025-10-16', startTime: '13:00', endTime: '16:00' },
                    { date: '2025-10-17', startTime: '10:00', endTime: '15:00' },
                ]
            };
            setExaminerAvailabilityData(mockAvailability);
        } catch (error) {
            console.error('Error fetching examiner availability:', error);
        }
    }, []);

    // Check if a time slot is available for an examiner
    const isSlotAvailable = async (examinerId, date, startTime, endTime) => {
        try {
            // For debugging
            console.log('Checking availability for examiner:', examinerId || 'Unknown');
            
            // Check if we have cached availability data for this examiner
            if (examinerId && examinerAvailabilityData[examinerId]) {
                const dateStr = date.toISOString().split('T')[0];
                const slots = examinerAvailabilityData[examinerId];
                
                // Check if any available slot covers the requested time
                return slots.some(slot => 
                    slot.date === dateStr && 
                    slot.startTime <= startTime && 
                    slot.endTime >= endTime
                );
            }
            
            // If we don't have cached data or no matching slots, 
            // use a random check (30% chance examiner is unavailable)
            const isAvailable = Math.random() > 0.3;
            
            console.log(`Availability check for ${examinerId || 'Unknown'} on ${date.toISOString().split('T')[0]} from ${startTime} to ${endTime}: ${isAvailable}`);
            
            return isAvailable;
        } catch (error) {
            console.error('Error checking availability:', error);
            return false; // Default to unavailable if check fails
        }
    };

    useEffect(() => {
        fetchPresentations();
        fetchExaminerAvailability();
    }, [fetchPresentations, fetchExaminerAvailability]);

    // Handle date selection
    const handleDateSelect = (selectInfo) => {
        const startDate = selectInfo.start;
        const endDate = selectInfo.end;

        // Calculate duration in minutes
        const durationMinutes = Math.round((endDate - startDate) / 60000);

        // Format date and time for the form
        const date = startDate.toISOString().split('T')[0];
        const time = startDate.toTimeString().substring(0, 5);

        setSelectedPresentation({
            id: null,
            groupId: "",
            examinerId: "",
            date,
            time,
            location: "",
            duration: durationMinutes || 30,
            examinerName: "",
            examinerEmail: "",
            subjectName: "",
            description: "",
            status: "scheduled"
        });

        setIsModalOpen(true);
    };

    // Handle date click - opens form with selected date
    const handleDateClick = (info) => {
        const clickedDate = info.date;
        
        // Format date for the form (YYYY-MM-DD)
        const formattedDate = clickedDate.toISOString().split('T')[0];
        
        // Get current time (rounded to nearest 15 minutes)
        const now = new Date();
        const minutes = Math.ceil(now.getMinutes() / 15) * 15;
        const hours = now.getHours();
        const adjustedHours = minutes === 60 ? hours + 1 : hours;
        const adjustedMinutes = minutes === 60 ? 0 : minutes;
        
        // Format time as HH:MM
        const formattedTime = `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
        
        // Create new presentation data with the selected date
        const newPresentation = {
            id: null,
            groupId: "",
            examinerId: "",
            date: formattedDate,
            time: formattedTime,
            location: "",
            duration: 30,
            examinerName: "",
            examinerEmail: "",
            subjectName: "",
            description: "",
            status: "Scheduled" // Default status for new presentations
        };
        
        console.log("Setting selected presentation with date:", formattedDate);
        setSelectedPresentation(newPresentation);
        setIsModalOpen(true);
    };

    // Handle event click
    const handleEventClick = (clickInfo) => {
        const presentation = eventToPresentation(clickInfo.event);
        setSelectedPresentation(presentation);
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            if (formData.id) {
                // Update existing presentation
                setPresentations(presentations.map(p =>
                    p.id === formData.id ? formData : p
                ));
                toast.success('Presentation updated successfully');

            } else {
                // Add new presentation
                const newId = Math.max(...presentations.map(p => p.id), 0) + 1;
                setPresentations([...presentations, {
                    ...formData,
                    id: newId
                }]);
                toast.success('Presentation scheduled successfully!');
            }
        } catch (err) {
            console.error('Error saving presentation:', err);
            toast.error('Error saving presentation');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setSelectedPresentation(null);
        }
    };

    // Handle presentation deletion
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this presentation?')) {
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setPresentations(presentations.filter(p => p.id !== id));
            toast.success('Presentation deleted successfully!');
        } catch (err) {
            console.error('Error deleting presentation:', err);
            toast.error('Error deleting presentation');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setSelectedPresentation(null);
        }
    };

    // Handle event drag start
    const handleEventDragStart = (info) => {
        setIsDragging(true);
        // Store the original event data in case we need to revert
        setDraggedEvent({
            event: info.event,
            presentation: eventToPresentation(info.event)
        });
    };

    // Handle event drop (after drag)
    const handleEventDrop = async (info) => {
        setIsDragging(false);

        const { event } = info;
        const presentation = eventToPresentation(event);
        // Make sure we have a valid examinerId - use the one from extendedProps as fallback
        const examinerId = presentation.examinerId || event.extendedProps.examinerId || '';

        // Format times for availability check
        const startTime = event.start.toTimeString().substring(0, 5);
        const endTime = event.end.toTimeString().substring(0, 5);

        // Check if the new slot conflicts with examiner availability
        const isAvailable = await isSlotAvailable(
            examinerId,
            event.start,
            startTime,
            endTime
        );

        if (!isAvailable) {
            // Store the event and show confirmation dialog
            setDraggedEvent({
                event: event,
                presentation: presentation,
                delta: info.delta,
                revert: info.revert
            });
            setAvailabilityConflict(true);
            setConfirmationTitle('Availability Conflict');
            setConfirmationMessage('The examiner may not be available during this time slot. Do you still want to reschedule the presentation?');
            setShowConfirmation(true);
            return;
        }

        await updatePresentationAfterDrag(presentation, info.revert);
    };

    // Handle event resize
    const handleEventResize = async (info) => {
        setIsDragging(false);

        const { event } = info;
        const presentation = eventToPresentation(event);

        // Calculate new duration in minutes
        const durationMs = event.end - event.start;
        const durationMinutes = Math.round(durationMs / 60000);
        presentation.duration = durationMinutes;

        await updatePresentationAfterDrag(presentation, info.revert);
    };

    // Update presentation after drag or resize
    const updatePresentationAfterDrag = async (presentation, revert) => {
        setIsLoading(true);
        try {
            // Log the data being sent to help diagnose issues
            console.log('Updating presentation with data:', presentation);
            
            // Make sure we're using the correct ID format
            const presentationId = presentation._id || presentation.id;
            
            // Ensure the presentation has all required fields
            const updatedPresentation = {
                ...presentation,
                // Add any missing required fields with defaults
                status: presentation.status || 'Scheduled',
                duration: presentation.duration || 30,
                description: presentation.description || ''
            };
            
            // Call API to update the presentation
            await presentationService.updatePresentation(presentationId, updatedPresentation);
            toast.success('Presentation rescheduled successfully');

            // Update local state
            setPresentations(prev =>
                prev.map(p => (p._id === presentationId || p.id === presentationId) ? updatedPresentation : p)
            );
        } catch (error) {
            console.error('Error updating presentation:', error);
            // Show more detailed error if available from API
            if (error.response && error.response.data) {
                console.error('API Error details:', error.response.data);
                toast.error(`Failed to reschedule: ${error.response.data.error || 'Unknown error'}`);
            } else {
                toast.error('Failed to reschedule presentation');
            }
            if (revert) revert(); // Revert the drag if API call fails
        } finally {
            setIsLoading(false);
        }
    };

    // Handle confirmation dialog response
    const handleConfirmation = async (confirmed) => {
        setShowConfirmation(false);
        
        if (!confirmed) {
            if (draggedEvent) {
                draggedEvent.revert();
            }
            setDraggedEvent(null);
            setAvailabilityConflict(false);
            return;
        }

        if (draggedEvent) {
            try {
                await updatePresentationAfterDrag(draggedEvent.presentation, draggedEvent.revert);
                
                if (availabilityConflict) {
                    toast.warning('Presentation was rescheduled, but the examiner may have a scheduling conflict.', {
                        position: "bottom-right",
                        autoClose: 5000
                    });
                    setAvailabilityConflict(false);
                }
            } catch (err) {
                console.error('Error updating presentation:', err);
                toast.error('Failed to reschedule presentation', {
                    position: "bottom-right"
                });
                if (draggedEvent.revert) {
                    draggedEvent.revert();
                }
            }
            
            setDraggedEvent(null);
        }
    };

    // Generate PDF report
    const generatePdfReport = useCallback(() => {
        const doc = new jsPDF();
        const title = 'Presentation Schedule Report';

        // Add logo and title
        const logoWidth = 40;
        const logoHeight = 20;
        doc.addImage(SchedExLogo, 'PNG', 15, 10, logoWidth, logoHeight);

        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text(title, 60, 25);

        // Add date information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 60, 32);

        // Add current view information
        const viewText = currentView === 'dayGridMonth'
            ? `Month: ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
            : `Week: ${currentDate.toLocaleDateString()}`;
        doc.text(viewText, 60, 38);

        // Create table data
        const tableColumn = ["Date", "Time", "Group", "Subject", "Examiner", "Location", "Status"];
        const tableRows = presentations.map(p => [
            new Date(p.date).toLocaleDateString(),
            p.time,
            p.groupId,
            p.subjectName,
            p.examinerName,
            p.location,
            p.status
        ]);

        // Add table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 245, 255] },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 20 },
                6: { cellWidth: 25 }
            },
            didDrawPage: (data) => {
                // Add page number
                doc.setFontSize(8);
                doc.text(
                    `Page ${doc.internal.getNumberOfPages()}`,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
            }
        });

        // Save the PDF
        doc.save('presentation-schedule.pdf');
    }, [presentations, currentDate, currentView]);

    // Handle view change - used by the calendar view buttons
    const handleViewChange = useCallback((view) => {
        setCurrentView(view);
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(view);
        }
    }, []);

    // Update current date when calendar date changes
    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.start);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            generatePdfReport();
        }
    }, [generatePdfReport]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle date change from the DateNavigator
    const handleDateChange = (date) => {
        if (date && calendarApi) {
            // Go to the selected date
            calendarApi.gotoDate(date);
            
            // Highlight the selected date
            setHighlightedDate(date);
            
            // Update current date state
            setCurrentDate(date);
        }
    };

    // Handle highlighting for searched date
    const handleDayCellDidMount = (info) => {
        // Highlight the searched date if it matches
        if (highlightedDate && info.date.toDateString() === new Date(highlightedDate).toDateString()) {
            info.el.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; // Light blue background
            info.el.style.borderRadius = '8px';
            info.el.style.border = '2px solid #3b82f6';
        }
    };

    return (
        <div className="h-full flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Calendar toolbar */}
            <div className="bg-white p-4 space-y-4">
                {/* Top row with navigation and search */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => calendarApi?.prev()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" />
                            </svg>
                        </button>
                        <button 
                            className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            onClick={() => calendarApi?.today()}
                        >
                            Today
                        </button>
                        <button 
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => calendarApi?.next()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4.293 15.707a1 1 0 011.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" />
                            </svg>
                        </button>
                    </div>

                    <DateNavigator onDateChange={handleDateChange} />

                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${currentView === 'dayGridMonth' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('dayGridMonth')}
                        >
                            Month
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${currentView === 'timeGridWeek' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('timeGridWeek')}
                        >
                            Week
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${currentView === 'timeGridDay' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('timeGridDay')}
                        >
                            Day
                        </button>
                    </div>
                </div>

                {/* Bottom row with action buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={generatePdfReport}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        Export PDF
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => {
                            setSelectedPresentation(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        New Presentation
                    </button>
                </div>
            </div>

            {/* Calendar container */}
            <div className="flex-grow overflow-auto relative" style={{ height: 'calc(100vh - 180px)' }}>
                {isDragging && (
                    <div className="absolute inset-0 bg-transparent pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg text-gray-700 font-medium border-2 border-blue-500">
                            Drag to reschedule • Release to confirm
                        </div>
                    </div>
                )}
                <FullCalendar
                    ref={(node) => {
                        calendarRef.current = node;
                        if (node) {
                            setCalendarApi(node.getApi());
                        }
                    }}
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin
                    ]}
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: ''
                    }}
                    initialView={currentView}
                    titleFormat={{ year: 'numeric', month: 'long' }}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={3}
                    weekends={true}
                    events={events}
                    dateClick={handleDateClick}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }}
                    eventContent={renderEventContent}
                    datesSet={handleDatesSet}
                    dayCellDidMount={handleDayCellDidMount}
                    nowIndicator={true}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                        startTime: '08:00',
                        endTime: '18:00',
                    }}
                    height="100%"
                    allDaySlot={false}
                    slotDuration="00:15:00"
                    slotLabelInterval="01:00"
                    slotMinTime="08:00:00"
                    slotMaxTime="18:00:00"
                    scrollTime="08:00:00"
                    editable={true}
                    eventDragStart={handleEventDragStart}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    eventResizableFromStart={true}
                    droppable={true}
                    snapDuration="00:15:00"
                    aspectRatio={1.8}
                    contentHeight="100%"
                    stickyHeaderDates={true}
                    dayHeaderFormat={{ weekday: 'long' }}
                    dayCellClassNames={(arg) => {
                        const today = new Date();
                        if (arg.date.toDateString() === today.toDateString()) {
                            return 'today-cell';
                        }
                        return '';
                    }}
                    views={{
                        dayGridMonth: {
                            dayMaxEventRows: 4,
                            dayHeaderFormat: { weekday: 'short' },
                            titleFormat: { year: 'numeric', month: 'long' }
                        },
                        timeGridWeek: {
                            dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
                            slotLabelFormat: {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            },
                            titleFormat: { year: 'numeric', month: 'long' }
                        },
                        timeGridDay: {
                            dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric' },
                            slotLabelFormat: {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            },
                            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                        }
                    }}
                />
            </div>  

            {/* Presentation form modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPresentation(null);
                }}
                title={selectedPresentation?.id ? "Edit Presentation" : "Schedule New Presentation"}
                size="xl"
            >
                <PresentationForm
                    initialValues={selectedPresentation || {}}
                    onSubmit={handleFormSubmit}
                    onDelete={selectedPresentation?.id ? () => handleDelete(selectedPresentation.id) : null}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <ConfirmationDialog
                    isOpen={showConfirmation}
                    onClose={() => handleConfirmation(false)}
                    onConfirm={() => handleConfirmation(true)}
                    title={confirmationTitle || "Confirm Action"}
                    message={confirmationMessage || "Are you sure you want to proceed with this action?"}
                    confirmText={availabilityConflict ? "Reschedule Anyway" : "Confirm"}
                    cancelText="Cancel"
                />
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
};

// Custom event rendering
const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const status = event.extendedProps.status;
    const config = statusConfig[status] || {};
    const isMonthView = eventInfo.view.type === 'dayGridMonth';

    return (
        <div 
            className="event-card overflow-hidden h-full transition-all duration-200 hover:shadow-md" 
            style={{
                background: config.backgroundColor,
                borderLeft: `4px solid ${config.color}`,
                borderRadius: '4px',
                padding: isMonthView ? '4px' : '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
        >
            {/* Event Header */}
            <div className="flex justify-between items-center mb-1">
                <div 
                    className="font-medium truncate" 
                    style={{ 
                        color: config.darkText,
                        fontSize: isMonthView ? '11px' : '13px'
                    }}
                >
                    {event.title}
                </div>
                <div 
                    className="px-2 py-0.5 rounded-full text-xs font-medium ml-1 flex-shrink-0" 
                    style={{ 
                        background: config.color,
                        color: 'white',
                        fontSize: isMonthView ? '9px' : '11px'
                    }}
                >
                    {status}
                </div>
            </div>
            
            {/* Event Details */}
            <div 
                className="text-xs flex items-center gap-1" 
                style={{ color: config.darkText }}
            >
                <span className="font-medium">{event.extendedProps.examinerName}</span>
                {event.extendedProps.duration && (
                    <span className="opacity-75">({event.extendedProps.duration} min)</span>
                )}
            </div>
            
            {/* Additional details for week/day view */}
            {!isMonthView && (
                <>
                    <div 
                        className="text-xs mt-2 flex items-center" 
                        style={{ color: config.darkText }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        <span className="truncate">{event.extendedProps.location}</span>
                    </div>
                    
                    <div className="text-xs mt-1 flex justify-between items-center">
                        <span 
                            className="font-mono px-1.5 py-0.5 rounded bg-opacity-20" 
                            style={{ 
                                backgroundColor: `${config.color}30`,
                                color: config.darkText 
                            }}
                        >
                            {event.extendedProps.groupId}
                        </span>
                        
                        {event.extendedProps.description && (
                            <span 
                                className="truncate ml-2 italic" 
                                style={{ color: config.darkText, maxWidth: '120px' }}
                            >
                                {event.extendedProps.description}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Calendar;