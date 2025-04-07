import React, { createContext, useState, useContext } from 'react';

const SlotContext = createContext();

export const SlotProvider = ({ children }) => {
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
    sessions: []
  });

  const addSlot = (newSlot) => {
    setSlots(prevSlots => ({
      ...prevSlots,
      sessions: [...prevSlots.sessions, newSlot]
    }));
  };

  const updateSlot = (index, updatedSlot) => {
    setSlots(prevSlots => {
      const newSessions = [...prevSlots.sessions];
      newSessions[index] = updatedSlot;
      return { ...prevSlots, sessions: newSessions };
    });
  };

  const deleteSlot = (index) => {
    setSlots(prevSlots => ({
      ...prevSlots,
      sessions: prevSlots.sessions.filter((_, i) => i !== index)
    }));
  };

  const toggleSlotStatus = (index) => {
    setSlots(prevSlots => {
      const newSessions = [...prevSlots.sessions];
      newSessions[index] = {
        ...newSessions[index],
        isActive: !newSessions[index].isActive
      };
      return { ...prevSlots, sessions: newSessions };
    });
  };

  return (
    <SlotContext.Provider value={{ 
      slots, 
      addSlot, 
      updateSlot, 
      deleteSlot, 
      toggleSlotStatus 
    }}>
      {children}
    </SlotContext.Provider>
  );
};

export const useSlots = () => {
  const context = useContext(SlotContext);
  if (!context) {
    throw new Error('useSlots must be used within a SlotProvider');
  }
  return context;
}; 