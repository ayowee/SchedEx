import React, { useState } from 'react';
import './Scheduler.css';

const Scheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate an array of days in the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Handle date selection
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  // Handle adding an event
  const handleAddEvent = (event) => {
    if (selectedDate) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDate]: [...(prevEvents[selectedDate] || []), event],
      }));
    }
  };

  return (
    <div className="scheduler">
      <h2>February 2024</h2>
      <div className="calendar-grid">
        {/* Render day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Render empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="empty-cell"></div>
        ))}

        {/* Render days of the month */}
        {daysArray.map((day) => (
          <div
            key={day}
            className={`day-cell ${selectedDate === day ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day}
            {events[day] && (
              <div className="events">
                {events[day].map((event, index) => (
                  <div key={index} className="event">
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Event Form */}
      {selectedDate && (
        <div className="add-event-form">
          <input
            type="text"
            placeholder="Add an event"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddEvent(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Scheduler;