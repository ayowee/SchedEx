import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SlotTable from '../components/SlotTable/SlotTable';
import toast from 'react-hot-toast';

const SlotManagingPage = () => {
  const [slots, setSlots] = useState({
    examiner: {
      name: "Dr. John Doe",
      id: "EX001",
      email: "john.doe@university.edu",
      mobile: "+1234567890"
    },
    module: {
      name: "Advanced Software Engineering",
      moduleId: "SE4001",
      specialization: "Software Engineering",
      semester: "4"
    },
    sessions: [
      {
        name: "Morning Session",
        type: "Lecture",
        startTime: "09:00",
        endTime: "11:00",
        location: "Room A101",
        deliveryMethod: "In-person",
        date: "2024-03-20",
        isActive: true
      },
      {
        name: "Afternoon Session",
        type: "Lab",
        startTime: "14:00",
        endTime: "16:00",
        location: "Lab B202",
        deliveryMethod: "In-person",
        date: "2024-03-20",
        isActive: false
      }
    ]
  });

  const navigate = useNavigate();

  const handleEdit = (slotData) => {
    navigate('/add-slots', { state: { editMode: true, slotData } });
  };

  const handleToggleStatus = (sessionIndex) => {
    setSlots(prevSlots => {
      const newSlots = { ...prevSlots };
      newSlots.sessions[sessionIndex].isActive = !newSlots.sessions[sessionIndex].isActive;
      return newSlots;
    });
    toast.success('Status updated successfully');
  };

  const handleDelete = (slotData) => {
    setSlots(prevSlots => {
      const newSlots = { ...prevSlots };
      newSlots.sessions = newSlots.sessions.filter((_, index) => index !== slotData.sessionIndex);
      return newSlots;
    });
    toast.success('Slot deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Slots</h1>
          <p className="mt-4 text-lg text-gray-600">
            View and manage your examination slots. Toggle their status or make changes as needed.
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <SlotTable 
            data={slots} 
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default SlotManagingPage;