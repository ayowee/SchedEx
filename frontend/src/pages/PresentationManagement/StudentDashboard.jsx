import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { presentationService } from '../../services/api';
import Modal from '../../components/ui/modal';
import PresentationForm from '../../components/forms/PresentationForm';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import DateNavigator from '../../components/presentationManagement/Calendar/DateNavigator';
import PageMeta from '../../components/common/PageMeta';
import './student-calendar-styles.css';

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
    'cancelled': {
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

        // Create the event object
        return {
            id: presentation.id || presentation._id, // Handle MongoDB _id
            title: `Group ${presentation.groupId}`,
            start: dateTime,
            end: endDateTime,
            allDay: false,
            extendedProps: {
                groupId: presentation.groupId,
                examinerId: presentation.examinerId,
                examinerName: presentation.examinerName,
                examinerEmail: presentation.examinerEmail,
                location: presentation.location,
                subjectName: presentation.subjectName,
                description: presentation.description,
                status: status,
                duration: presentation.duration
            },
            backgroundColor: statusConfig[status]?.color || '#3B82F6',
            borderColor: statusConfig[status]?.borderColor || '#93C5FD',
            textColor: '#FFFFFF'
        };
    } catch (error) {
        console.error('Error converting presentation to event:', error, presentation);
        return null;
    }
};

// Convert calendar event to presentation format
const eventToPresentation = (event) => {
    const startDate = new Date(event.start);
    return {
        id: event.id,
        groupId: event.extendedProps.groupId,
        examinerId: event.extendedProps.examinerId,
        examinerName: event.extendedProps.examinerName,
        examinerEmail: event.extendedProps.examinerEmail,
        date: format(startDate, 'yyyy-MM-dd'),
        time: format(startDate, 'HH:mm'),
        duration: event.extendedProps.duration || 30,
        location: event.extendedProps.location,
        subjectName: event.extendedProps.subjectName,
        description: event.extendedProps.description,
        status: event.extendedProps.status
    };
};

const StudentDashboard = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [upcomingPresentations, setUpcomingPresentations] = useState([]);
    
    const calendarRef = useRef(null);

    // Fetch presentations from the API
    const fetchPresentations = async () => {
        try {
            setIsLoading(true);
            const data = await presentationService.getAllPresentations();
            
            // Convert presentations to calendar events
            const validEvents = data
                .map(presentationToEvent)
                .filter(event => event !== null);
            
            setEvents(validEvents);
            
            // Filter upcoming presentations (next 7 days)
            const now = new Date();
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            
            const upcoming = data.filter(presentation => {
                const presentationDate = new Date(`${presentation.date}T${presentation.time}`);
                return presentationDate >= now && presentationDate <= nextWeek;
            });
            
            setUpcomingPresentations(upcoming);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            toast.error('Failed to load presentations');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPresentations();
    }, []);

    // Handle event click
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleFormSubmit = async (formData) => {
        try {
            if (selectedEvent) {
                // Update existing presentation
                await presentationService.updatePresentation(selectedEvent.id, formData);
                toast.success('Presentation updated successfully');
            } else {
                // Create new presentation
                await presentationService.createPresentation(formData);
                toast.success('Presentation scheduled successfully');
            }
            
            setIsModalOpen(false);
            setSelectedEvent(null);
            fetchPresentations(); // Refresh data
        } catch (error) {
            console.error('Error saving presentation:', error);
            toast.error('Failed to save presentation');
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        setConfirmAction(() => async () => {
            try {
                await presentationService.deletePresentation(id);
                toast.success('Presentation deleted successfully');
                setIsModalOpen(false);
                setSelectedEvent(null);
                fetchPresentations(); // Refresh data
            } catch (error) {
                console.error('Error deleting presentation:', error);
                toast.error('Failed to delete presentation');
            }
        });
        
        setConfirmDialogOpen(true);
    };

    // Handle confirmation dialog response
    const handleConfirmation = (confirmed) => {
        setConfirmDialogOpen(false);
        
        if (confirmed && confirmAction) {
            confirmAction();
        }
        
        setConfirmAction(null);
    };

    // Update current date when calendar date changes
    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.start);
    };

    // Handle date change from date navigator
    const handleDateChange = ({ start }) => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(start);
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

    return (
        <div className="h-full">
            <PageMeta title="Student Dashboard" />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Calendar Section - 3/4 of screen */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4 h-full">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Presentation Schedule</h1>
                            <DateNavigator 
                                currentDate={currentDate} 
                                onDateChange={handleDateChange}
                            />
                        </div>
                        
                        <div className="flex-grow">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={events}
                                eventContent={renderEventContent}
                                eventClick={handleEventClick}
                                height="100%"
                                datesSet={handleDatesSet}
                                allDaySlot={false}
                                slotMinTime="08:00:00"
                                slotMaxTime="20:00:00"
                                slotDuration="00:15:00"
                                slotLabelInterval="01:00:00"
                                slotLabelFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }}
                                businessHours={{
                                    daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                                    startTime: '09:00',
                                    endTime: '17:00',
                                }}
                                nowIndicator={true}
                                dayMaxEvents={3}
                                eventTimeFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Upcoming Presentations Section - 1/4 of screen */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Presentations</h2>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : upcomingPresentations.length > 0 ? (
                        <div className="space-y-4 overflow-auto max-h-[calc(100vh-12rem)]">
                            {upcomingPresentations.map(presentation => {
                                const presentationDate = new Date(`${presentation.date}T${presentation.time}`);
                                const status = presentation.status.toLowerCase();
                                const config = statusConfig[status] || statusConfig.scheduled;
                                
                                return (
                                    <div 
                                        key={presentation._id} 
                                        className="p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                                        style={{ 
                                            borderLeftColor: config.color,
                                            backgroundColor: config.backgroundColor
                                        }}
                                        onClick={() => {
                                            // Find corresponding event
                                            const event = events.find(e => e.id === presentation._id);
                                            if (event) {
                                                setSelectedEvent({ 
                                                    id: presentation._id,
                                                    title: `Group ${presentation.groupId}`,
                                                    start: presentationDate,
                                                    end: new Date(presentationDate.getTime() + presentation.duration * 60000),
                                                    extendedProps: {
                                                        ...presentation,
                                                        status: status
                                                    }
                                                });
                                                setIsViewOnly(true);
                                                setIsModalOpen(true);
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium" style={{ color: config.darkText }}>
                                                    Group {presentation.groupId}
                                                </h3>
                                                <p className="text-sm mt-1" style={{ color: config.darkText }}>
                                                    {presentation.subjectName}
                                                </p>
                                            </div>
                                            <span 
                                                className="px-2 py-1 text-xs rounded-full font-medium"
                                                style={{ 
                                                    backgroundColor: config.color,
                                                    color: 'white'
                                                }}
                                            >
                                                {status}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-3 text-sm" style={{ color: config.darkText }}>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    {format(presentationDate, 'MMM d, yyyy')} at {format(presentationDate, 'h:mm a')}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{presentation.location}</span>
                                            </div>
                                            
                                            <div className="flex items-center mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{presentation.examinerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-center">No upcoming presentations scheduled</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal for viewing presentation details */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    title={selectedEvent ? "Presentation Details" : "Schedule Presentation"}
                >
                    <PresentationForm
                        initialData={selectedEvent ? eventToPresentation(selectedEvent) : null}
                        onSubmit={handleFormSubmit}
                        onDelete={selectedEvent ? () => handleDelete(selectedEvent.id) : null}
                        isViewOnly={isViewOnly}
                    />
                </Modal>
            )}
            
            {/* Confirmation Dialog */}
            {confirmDialogOpen && (
                <ConfirmationDialog
                    isOpen={confirmDialogOpen}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this presentation? This action cannot be undone."
                    onConfirm={() => handleConfirmation(true)}
                    onCancel={() => handleConfirmation(false)}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
            
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default StudentDashboard;
