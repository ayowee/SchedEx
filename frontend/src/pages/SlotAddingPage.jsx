import React from 'react';
import SlotForm from '../components/SlotForm/SlotForm';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const SlotAddingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.editMode;

  const handleSubmit = (formData) => {
    // Here you would typically make an API call to save the data
    console.log('Form submitted:', formData);
    
    if (isEditMode) {
      toast.success('Slot updated successfully');
    } else {
      toast.success('Slots created successfully');
    }
    
    // Navigate back to the manage slots page after successful submission
    navigate('/create-slot');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-7xl mx-auto p-8 w-full flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Slot' : 'Add New Slots'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {isEditMode 
              ? 'Update the examination slot details below.'
              : 'Create new examination slots by filling out the form below.'
            }
          </p>
        </header>
        
        <div className="bg-white">
          <SlotForm 
            mode={isEditMode ? 'edit' : 'create'} 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default SlotAddingPage; 