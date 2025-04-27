import { useState, useRef, useEffect, useCallback } from 'react';
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

// Status configuration with colors
const statusConfig = {
    'Scheduled': { 
        color: '#3B82F6', // Bright blue
        textColor: '#1E40AF',
        backgroundColor: '#EFF6FF',
        gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)'
    },
    'Completed': { 
        color: '#10B981', // Green
        textColor: '#065F46',
        backgroundColor: '#ECFDF5',
        gradient: 'linear-gradient(135deg, #10B981, #059669)'
    },
    'Cancelled': { 
        color: '#EF4444', // Red
        textColor: '#991B1B',
        backgroundColor: '#FEF2F2',
        gradient: 'linear-gradient(135deg, #EF4444, #DC2626)'
    }
};

// Convert presentation data to calendar event format
const presentationToEvent = (presentation) => {
    const dateTime = new Date(`${presentation.date}T${presentation.time}`);
    const endDateTime = new Date(dateTime.getTime() + presentation.duration * 60000);
    
    return {
        id: presentation.id,
        title: presentation.subjectName,
        start: dateTime,
        end: endDateTime,
        groupId: presentation.groupId,
        location: presentation.location,
        backgroundColor: statusConfig[presentation.status]?.color || '#64748B',
        borderColor: statusConfig[presentation.status]?.color || '#64748B',
        textColor: '#FFFFFF',
        extendedProps: {
            examinerName: presentation.examinerName,
            examinerEmail: presentation.examinerEmail,
            examinerId: presentation.examinerId,
            description: presentation.description,
            status: presentation.status,
            duration: presentation.duration
        }
    };
};

// Convert calendar event to presentation format
const eventToPresentation = (event) => {
    const startDate = event.start;
    
    return {
        id: event.id,
        groupId: event.groupId,
        examinerId: event.extendedProps.examinerId,
        date: startDate.toISOString().split('T')[0],
        time: startDate.toTimeString().substring(0, 5),
        location: event.location,
        duration: event.extendedProps.duration,
        examinerName: event.extendedProps.examinerName,
        examinerEmail: event.extendedProps.examinerEmail,
        subjectName: event.title,
        description: event.extendedProps.description,
        status: event.extendedProps.status
    };
};

const Calendar = () => {
    // Initial data - this would typically come from an API or parent component
    const initialPresentations = [
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
            status: "Scheduled"
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
            status: "Completed"
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
            status: "Cancelled"
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
            status: "Scheduled"
        }
    ];

    // State management
    const [presentations, setPresentations] = useState(initialPresentations);
    const [selectedPresentation, setSelectedPresentation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewType, setViewType] = useState('dayGridMonth');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [showLegend, setShowLegend] = useState(true);
    
    const calendarRef = useRef(null);

    // Convert presentations to calendar events
    const events = presentations
        .filter(p => statusFilter === 'All' || p.status === statusFilter)
        .filter(p => locationFilter === 'All' || p.location === locationFilter)
        .map(presentationToEvent);

    // Get unique locations for filter
    const locations = ['All', ...new Set(presentations.map(p => p.location))];

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
            status: "Scheduled"
        });
        
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
                toast.success('Presentation updated successfully!');
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

    // Generate PDF report of current calendar view
    const generateReport = useCallback(() => {
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Company logo configuration
            const logoConfig = {
                url: SchedExLogo,
                type: 'PNG',
                x: 130,
                y: 25,
                width: 45,
                height: 7.5
            };

            // Report title and header
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Scheduled Presentations Calendar', 150, 45, { align: 'center' });

            // Report metadata
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`Report Generated: ${new Date().toLocaleString()}`, 150, 52, { align: 'center' });
            doc.text(`Total Presentations: ${presentations.length}`, 150, 57, { align: 'center' });
            doc.text(`View: ${viewType}`, 150, 62, { align: 'center' });
            doc.text(`Date Range: ${currentDate.toLocaleDateString()}`, 150, 67, { align: 'center' });

            // Add company logo
            doc.addImage(
                logoConfig.url,
                logoConfig.type,
                logoConfig.x,
                logoConfig.y,
                logoConfig.width,
                logoConfig.height,
                {align: 'left'}
            );

            // Table columns
            const headers = [['Date', 'Time', 'Group ID', 'Examiner', 'Location', 'Duration', 'Subject', 'Status']];

            // Table data
            const data = presentations.map(pres => [
                new Date(pres.date).toLocaleDateString(),
                pres.time,
                pres.groupId,
                pres.examinerName,
                pres.location,
                `${pres.duration} mins`,
                pres.subjectName,
                pres.status
            ]);

            // Add table to document
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 75,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                }
            });

            // Save the PDF
            doc.save('presentation-calendar-report.pdf');
            toast.success('PDF report generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error generating PDF report');
        }
    }, [presentations, currentDate, viewType]);

    // Handle view change
    const handleViewChange = (view) => {
        setViewType(view);
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(view);
        }
    };

    // Update current date when calendar date changes
    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.start);
    };

    // Add keyboard shortcut for report generation (Ctrl+P)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                generateReport();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [generateReport]);

    return (
        <div className="calendar-container p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Presentation Calendar</h1>
                <p className="text-gray-600 text-lg">Schedule and manage presentation slots with ease</p>
            </div>
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center mb-8 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* View selector */}
                    <div className="flex rounded-md shadow-sm">
                        <button 
                            className={`px-5 py-2.5 text-sm font-medium rounded-l-md transition-all duration-200 ${viewType === 'dayGridMonth' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('dayGridMonth')}
                        >
                            Month
                        </button>
                        <button 
                            className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${viewType === 'timeGridWeek' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('timeGridWeek')}
                        >
                            Week
                        </button>
                        <button 
                            className={`px-5 py-2.5 text-sm font-medium rounded-r-md transition-all duration-200 ${viewType === 'timeGridDay' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => handleViewChange('timeGridDay')}
                        >
                            Day
                        </button>
                    </div>
                    
                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-4 bg-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    {/* Location filter */}
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-4 bg-white"
                    >
                        {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                    
                    {/* Toggle legend */}
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="px-4 py-2.5 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-all duration-200"
                    >
                        {showLegend ? 'Hide Legend' : 'Show Legend'}
                    </button>
                </div>
            </div>
            
            {/* Status legend */}
            {showLegend && (
                <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                    {Object.entries(statusConfig).map(([status, config]) => (
                        <div key={status} className="flex items-center">
                            <div className="w-5 h-5 rounded-full mr-2 shadow-sm" style={{ background: config.gradient }}></div>
                            <span className="text-sm font-medium text-gray-700">{status}</span>
                        </div>
                    ))}
                    <div className="ml-auto text-xs text-gray-500">
                        Press <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">P</kbd> to export calendar as PDF
                    </div>
                </div>
            )}
            
            {/* Calendar */}
            <div className="calendar-wrapper rounded-xl overflow-hidden shadow-lg border border-gray-100" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[
                        dayGridPlugin, 
                        timeGridPlugin, 
                        interactionPlugin
                    ]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: ''
                    }}
                    selectable={true}
                    select={handleDateSelect}
                    events={events}
                    eventClick={handleEventClick}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }}
                    datesSet={handleDatesSet}
                    eventContent={renderEventContent}
                    dayMaxEvents={3}
                    eventDisplay="block"
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
            
            <ToastContainer position="bottom-right" />
        </div>
    );
};

// Custom event rendering
const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const status = event.extendedProps.status;
    const config = statusConfig[status] || {};
    
    return (
        <div className="event-card p-2 overflow-hidden h-full transition-all duration-200 hover:shadow-md" style={{ 
            background: config.backgroundColor,
            borderLeft: `4px solid ${config.color}`,
            borderRadius: '4px'
        }}>
            <div className="font-medium text-sm truncate">{event.title}</div>
            <div className="text-xs flex items-center gap-1 mt-1">
                <span className="font-medium">{event.extendedProps.examinerName}</span>
                {event.extendedProps.duration && (
                    <span className="opacity-75">({event.extendedProps.duration} min)</span>
                )}
            </div>
            {eventInfo.view.type !== 'dayGridMonth' && (
                <div className="text-xs mt-2 flex justify-between items-center">
                    <span className="opacity-75 font-mono">{event.extendedProps.groupId}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" 
                          style={{ 
                              background: config.gradient || config.color,
                              color: 'white'
                          }}>
                        {status}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Calendar;