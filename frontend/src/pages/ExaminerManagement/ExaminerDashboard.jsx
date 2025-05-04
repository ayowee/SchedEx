import React, { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, PresentationChartLineIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ExaminerDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleLogout = () => {
    // Clear any stored tokens/session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/user/login');
    toast.success('Logged out successfully');
  };
  
  // Sample data - replace with actual data from your backend
  const upcomingPresentations = [
    { id: 1, title: 'Final Year Project', student: 'John Doe', date: '2025-05-10', time: '10:00 AM' },
    { id: 2, title: 'Research Proposal', student: 'Jane Smith', date: '2025-05-12', time: '2:30 PM' },
  ];

  const availableTimeSlots = [
    { id: 1, date: '2025-05-15', startTime: '09:00 AM', endTime: '11:00 AM' },
    { id: 2, date: '2025-05-15', startTime: '02:00 PM', endTime: '04:00 PM' },
    { id: 3, date: '2025-05-16', startTime: '10:00 AM', endTime: '12:00 PM' },
  ];

  const statistics = [
    { title: 'Upcoming Presentations', value: '5', icon: PresentationChartLineIcon },
    { title: 'Students Assigned', value: '12', icon: UserGroupIcon },
    { title: 'Available Time Slots', value: '8', icon: ClockIcon },
    { title: 'This Week\'s Sessions', value: '3', icon: CalendarDaysIcon },
  ];

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    toast.success('Time slot selected successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Examiner Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Presentations */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Presentations</h2>
            <div className="space-y-4">
              {upcomingPresentations.map((presentation) => (
                <div key={presentation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{presentation.title}</h3>
                    <p className="text-sm text-gray-600">{presentation.student}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{presentation.date}</p>
                    <p className="text-sm text-gray-600">{presentation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h2>
            <div className="space-y-4">
              {availableTimeSlots.map((slot) => (
                <div 
                  key={slot.id} 
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors
                    ${selectedTimeSlot?.id === slot.id 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  <div className="flex items-center space-x-4">
                    <ClockIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTimeSlotSelect(slot);
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow border border-gray-100">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100">
              <CalendarDaysIcon className="w-5 h-5" />
              View Schedule
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100">
              <UserGroupIcon className="w-5 h-5" />
              Manage Students
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100">
              <PresentationChartLineIcon className="w-5 h-5" />
              View Presentations
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ExaminerDashboard;
