import { useState, useEffect, useRef } from 'react';
import DashboardMetrics from '../../components/presentationManagement/Dashboard/Metrics';
import PresentationCharts from '../../components/presentationManagement/Dashboard/Charts';
import RecentActivity from '../../components/presentationManagement/Dashboard/RecentActivity';
import MiniCalendar from '../../components/presentationManagement/Dashboard/MiniCalendar';
import { presentationService, userService } from '../../services/api';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const [filters, setFilters] = useState({
        dateRange: 'last30',
        status: 'all',
        examiner: ''
    });
    
    const [presentations, setPresentations] = useState([]);
    const [examiners, setExaminers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    
    // State for dropdown visibility
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    
    // Refs for dropdown containers
    const dateDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    // Date range options
    const dateRangeOptions = [
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last7', label: 'Last 7 days' },
        { value: 'last30', label: 'Last 30 days' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' }
    ];
    
    // Status options
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    // Handle click outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
                setDateDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setStatusDropdownOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch presentations data
                const presentationsData = await presentationService.getAllPresentations();
                setPresentations(presentationsData);
                
                // Fetch examiners data
                const usersData = await userService.getAllUsers();
                const examinerUsers = usersData.filter(user => user.role === 'examiner');
                setExaminers(examinerUsers);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Handle date selection from the mini calendar
    const handleDateClick = (date) => {
        setSelectedDate(date);
        // You could add additional logic here to filter presentations by the selected date
    };
    
    // Handle date range selection
    const handleDateRangeSelect = (value) => {
        setFilters({ ...filters, dateRange: value });
        setDateDropdownOpen(false);
    };
    
    // Handle status selection
    const handleStatusSelect = (value) => {
        setFilters({ ...filters, status: value });
        setStatusDropdownOpen(false);
    };

    // Filter presentations based on selected filters
    const filteredPresentations = presentations.filter(presentation => {
        // Filter by status
        if (filters.status !== 'all' && 
            presentation.status.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
        }
        
        // Filter by date range
        const presentationDate = new Date(presentation.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        
        switch (filters.dateRange) {
            case 'today':
                return presentationDate.toDateString() === today.toDateString();
            case 'yesterday':
                return presentationDate.toDateString() === yesterday.toDateString();
            case 'last7':
                return presentationDate >= last7Days;
            case 'last30':
                return presentationDate >= last30Days;
            case 'thisMonth':
                return presentationDate >= thisMonthStart;
            case 'lastMonth':
                return presentationDate >= lastMonthStart && presentationDate <= lastMonthEnd;
            default:
                return true;
        }
    });

    // Further filter by selected date if one is chosen
    const dateFilteredPresentations = selectedDate 
        ? filteredPresentations.filter(p => {
            const pDate = new Date(p.date);
            return pDate.toDateString() === selectedDate.toDateString();
          })
        : filteredPresentations;
        
    // Get current date range label
    const getCurrentDateRangeLabel = () => {
        const option = dateRangeOptions.find(opt => opt.value === filters.dateRange);
        return option ? option.label : 'Last 30 days';
    };
    
    // Get current status label
    const getCurrentStatusLabel = () => {
        const option = statusOptions.find(opt => opt.value === filters.status);
        return option ? option.label : 'All Statuses';
    };

    return (
        <>
            {/* Page Title & Filters */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Overview
                    {selectedDate && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            Viewing: {selectedDate.toLocaleDateString()}
                        </span>
                    )}
                </h1>
                
                <div className="flex flex-wrap gap-3">
                    {/* Date Range Dropdown */}
                    <div className="relative" ref={dateDropdownRef}>
                        <button
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center justify-between min-w-[150px]"
                            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                        >
                            {getCurrentDateRangeLabel()}
                            <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {dateDropdownOpen && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full">
                                {dateRangeOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                            filters.dateRange === option.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
                                        }`}
                                        onClick={() => handleDateRangeSelect(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Status Dropdown */}
                    <div className="relative" ref={statusDropdownRef}>
                        <button
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center justify-between min-w-[150px]"
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                        >
                            {getCurrentStatusLabel()}
                            <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {statusDropdownOpen && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full">
                                {statusOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                            filters.status === option.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
                                        }`}
                                        onClick={() => handleStatusSelect(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metrics Row - Full Width */}
                <div className="lg:col-span-3">
                    <DashboardMetrics 
                        presentations={dateFilteredPresentations} 
                        examiners={examiners}
                        loading={loading}
                    />
                </div>
                
                {/* Charts - 2/3 Width */}
                <div className="lg:col-span-2 space-y-6">
                    <PresentationCharts 
                        presentations={filteredPresentations}
                        filters={filters}
                        loading={loading}
                    />
                </div>
                
                {/* Side Panels - 1/3 Width */}
                <div className="space-y-6">
                    {/* Mini Calendar */}
                    <MiniCalendar 
                        presentations={filteredPresentations}
                        loading={loading}
                        onDateClick={handleDateClick}
                    />
                    <RecentActivity 
                        presentations={dateFilteredPresentations}
                        loading={loading}
                    />
                </div>
            </div>
        </>
    );
}