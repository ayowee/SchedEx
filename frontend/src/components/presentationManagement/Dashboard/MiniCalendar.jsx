import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function MiniCalendar({ presentations = [], loading = false, onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [presentationsByDate, setPresentationsByDate] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);

  // Define status colors
  const statusColors = {
    scheduled: 'bg-blue-500',
    completed: 'bg-green-500',
    canceled: 'bg-red-500',
    cancelled: 'bg-red-500', // Support both spellings
    confirmed: 'bg-purple-500',
    default: 'bg-gray-400'
  };

  useEffect(() => {
    if (!loading && presentations.length > 0) {
      // Group presentations by date
      const presentationMap = {};
      presentations.forEach(p => {
        const dateStr = p.date.split('T')[0]; // Handle both date string and Date object formats
        if (!presentationMap[dateStr]) {
          presentationMap[dateStr] = [];
        }
        presentationMap[dateStr].push(p);
      });
      setPresentationsByDate(presentationMap);
    }
  }, [presentations, loading]);

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClickHandler = (day) => {
    setSelectedDate(day);
    if (onDateClick) {
      onDateClick(day);
    }
  };

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Check if a day has presentations
  const getPresentationsForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return presentationsByDate[dateStr] || [];
  };

  // Get dominant status for a day
  const getDominantStatus = (presentations) => {
    if (!presentations || presentations.length === 0) return 'default';
    
    // Count presentations by status
    const statusCount = presentations.reduce((acc, p) => {
      const status = p.status ? p.status.toLowerCase() : 'default';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Find the status with the most presentations
    let dominantStatus = 'default';
    
    // Priority order: scheduled > confirmed > completed > canceled > default
    if (statusCount.scheduled && statusCount.scheduled > 0) {
      dominantStatus = 'scheduled';
    } else if (statusCount.confirmed && statusCount.confirmed > 0) {
      dominantStatus = 'confirmed';
    } else if (statusCount.completed && statusCount.completed > 0) {
      dominantStatus = 'completed';
    } else if (statusCount.canceled && statusCount.canceled > 0) {
      dominantStatus = 'canceled';
    } else if (statusCount.cancelled && statusCount.cancelled > 0) {
      dominantStatus = 'cancelled';
    }
    
    return dominantStatus;
  };

  // Generate the days of the week header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Reset to today's date
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
    if (onDateClick) {
      onDateClick(new Date());
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Mini Calendar</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={goToToday}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
            title="Go to today"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Next month"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <h4 className="text-md font-medium text-gray-700">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayPresentations = getPresentationsForDay(day);
          const hasEvents = dayPresentations.length > 0;
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          // Get dominant status for color
          const dominantStatus = getDominantStatus(dayPresentations);
          const statusColorClass = hasEvents ? statusColors[dominantStatus] : '';
          
          return (
            <div 
              key={dayStr}
              className="relative"
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <button
                onClick={() => onDateClickHandler(day)}
                className={`
                  h-9 w-9 rounded-full flex items-center justify-center text-xs
                  transition-all duration-200 transform
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                  ${isToday(day) ? 'ring-2 ring-blue-300' : ''}
                  ${isSelected && !hasEvents ? 'bg-gray-100 font-bold' : ''}
                  ${hasEvents ? `${statusColorClass} text-white` : ''}
                  ${isSelected && hasEvents ? 'ring-2 ring-white' : ''}
                  ${isCurrentMonth && !hasEvents && !isSelected && !isToday(day) ? 'hover:bg-gray-50' : ''}
                  ${hoveredDay && isSameDay(hoveredDay, day) ? 'scale-110' : ''}
                `}
                title={hasEvents ? `${dayPresentations.length} presentation${dayPresentations.length > 1 ? 's' : ''}` : 'No presentations'}
              >
                {format(day, 'd')}
              </button>
              
              {/* Tooltip for hovered day with presentations */}
              {hoveredDay && isSameDay(hoveredDay, day) && hasEvents && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-48 text-xs left-1/2 transform -translate-x-1/2">
                  <div className="font-bold text-gray-800 mb-1">
                    {format(day, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-gray-700">
                    {dayPresentations.length} presentation{dayPresentations.length > 1 ? 's' : ''}
                  </div>
                  <ul className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                    {dayPresentations.slice(0, 3).map((p, idx) => (
                      <li key={idx} className="text-gray-600 truncate flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-1 ${statusColors[p.status ? p.status.toLowerCase() : 'default']}`}></span>
                        {p.time} - {p.subjectName || 'Presentation'}
                      </li>
                    ))}
                    {dayPresentations.length > 3 && (
                      <li className="text-blue-600 font-medium">
                        + {dayPresentations.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <div className="flex items-center">
            <span className="h-3 w-3 bg-blue-500 rounded-full mr-1"></span>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-red-500 rounded-full mr-1"></span>
            <span>Canceled</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-purple-500 rounded-full mr-1"></span>
            <span>Confirmed</span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span>Click a date to view presentations</span>
        </div>
      </div>
    </div>
  );
}
