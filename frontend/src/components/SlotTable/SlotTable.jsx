import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

const INITIAL_SLOTS = [
  {
    examiner: {
      id: 'EX001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '0771234567'
    },
    module: {
      moduleId: 'MOD001',
      name: 'Software Engineering',
      specialization: 'SE',
      semester: '1'
    },
    sessions: [
      {
        name: 'Final Viva',
        type: 'viva',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Room 101',
        deliveryMethod: 'offline',
        date: '2024-03-20',
        isActive: true
      },
      {
        name: 'Project Presentation',
        type: 'presentation',
        startTime: '14:00',
        endTime: '15:00',
        location: 'Room 102',
        deliveryMethod: 'online',
        date: '2024-03-21',
        isActive: false
      }
    ]
  }
];

const SlotTable = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSlots = localStorage.getItem('slots');
    if (savedSlots) {
      try {
        const parsed = JSON.parse(savedSlots);
        setSlots(Array.isArray(parsed) ? parsed : INITIAL_SLOTS);
      } catch (error) {
        console.error('Error loading slots:', error);
        setSlots(INITIAL_SLOTS);
      }
    }
  }, []);

  // Save data to localStorage whenever slots change
  useEffect(() => {
    localStorage.setItem('slots', JSON.stringify(slots));
  }, [slots]);

  // Handle toggle switch
  const handleToggle = (slotIndex, sessionIndex) => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotIndex].sessions[sessionIndex].isActive = 
        !newSlots[slotIndex].sessions[sessionIndex].isActive;
      localStorage.setItem('slots', JSON.stringify(newSlots));
      return newSlots;
    });
  };

  // Handle delete
  const handleDelete = (slotIndex) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(prevSlots => {
        const newSlots = prevSlots.filter((_, index) => index !== slotIndex);
        localStorage.setItem('slots', JSON.stringify(newSlots));
        toast.success('Slot deleted successfully');
        return newSlots;
      });
    }
  };

  // Handle edit
  const handleEdit = (slotIndex) => {
    const slotData = slots[slotIndex];
    navigate('/create-slot', { state: { slotData, slotIndex } });
  };

  // Filter slots based on search query
  const filteredSlots = slots.filter(slot => {
    const searchLower = searchQuery.toLowerCase();
    return (
      slot.examiner.name.toLowerCase().includes(searchLower) ||
      slot.examiner.id.toLowerCase().includes(searchLower) ||
      slot.module.name.toLowerCase().includes(searchLower) ||
      slot.module.moduleId.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Slot Management</h1>
        <button
          onClick={() => navigate('/create-slot')}
          className="bg-black text-green-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create New Slot
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search slots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Examiner
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredSlots.map((slot, slotIndex) => (
              slot.sessions.map((session, sessionIndex) => (
                <tr key={`${slotIndex}-${sessionIndex}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{slot.examiner.name}</div>
                    <div className="text-sm text-gray-500">{slot.examiner.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{slot.module.name}</div>
                    <div className="text-sm text-gray-500">{slot.module.moduleId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.name}</div>
                    <div className="text-sm text-gray-500">{session.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.date}</div>
                    <div className="text-sm text-gray-500">{session.startTime} - {session.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.location}</div>
                    <div className="text-sm text-gray-500">{session.deliveryMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={session.isActive}
                      onChange={() => handleToggle(slotIndex, sessionIndex)}
                      className={`${
                        session.isActive ? 'bg-green-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          session.isActive ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(slotIndex)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slotIndex)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotTable; 