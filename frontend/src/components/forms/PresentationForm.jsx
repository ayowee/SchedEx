import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const PresentationForm = ({ editingPresentation, onSubmit, onCancel, onDelete, isLoading }) => {
    const [formData, setFormData] = useState({
        id: null,
        groupId: '',
        examinerId: '',
        examinerName: '',
        examinerEmail: '',
        date: '',
        time: '',
        duration: 30,
        location: '',
        customLocation: '',
        subjectName: '',
        description: '',
        status: 'Scheduled'
    });

    const [errors, setErrors] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showCustomLocation, setShowCustomLocation] = useState(false);

    // Locations for dropdown - wrapped in useMemo to avoid dependency changes
    const locations = useMemo(() => ['Room A101', 'Room B205', 'Room C310', 'Conference Hall', 'Online', 'Other'], []);

    // Status options
    const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

    // Update form data when editingPresentation changes
    useEffect(() => {
        if (editingPresentation) {
            console.log("Editing presentation data:", editingPresentation);
            setFormData({
                ...editingPresentation,
                // Ensure we keep the MongoDB _id but also add an id field for form compatibility
                id: editingPresentation._id
            });

            // Check if location is in the predefined list or custom
            if (editingPresentation.location && !locations.includes(editingPresentation.location)) {
                setFormData(prev => ({
                    ...prev,
                    customLocation: editingPresentation.location,
                    location: 'Other'
                }));
                setShowCustomLocation(true);
            }
        }
    }, [editingPresentation, locations]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Perform real-time validation for the changed field
        validateField(name, value);
    };

    // Real-time field validation
    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'groupId':
                if (!value.trim()) {
                    errorMessage = 'Group ID is required';
                } else if (value.trim().length < 3) {
                    errorMessage = 'Group ID must be at least 3 characters';
                }
                break;

            case 'examinerName':
                if (!value.trim()) {
                    errorMessage = 'Examiner name is required';
                } else if (value.trim().length < 3) {
                    errorMessage = 'Examiner name must be at least 3 characters';
                }
                break;

            case 'examinerEmail':
                if (!value.trim()) {
                    errorMessage = 'Examiner email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Invalid email format';
                }
                break;

            case 'date':
                if (!value) {
                    errorMessage = 'Date is required';
                } else {
                    // Check if date is in the past
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

                    if (selectedDate < today) {
                        errorMessage = 'Cannot schedule presentations in the past';
                    }

                    // If date is today, check if time is in the past
                    if (selectedDate.toDateString() === today.toDateString() && formData.time) {
                        validateField('time', formData.time);
                    }
                }
                break;

            case 'time':
                if (!value) {
                    errorMessage = 'Time is required';
                } else if (formData.date) {
                    const selectedDate = new Date(formData.date);
                    const today = new Date();

                    // Only validate time if date is today
                    if (selectedDate.toDateString() === today.toDateString()) {
                        const [hours, minutes] = value.split(':').map(Number);
                        const selectedTime = new Date();
                        selectedTime.setHours(hours, minutes, 0, 0);

                        const currentTime = new Date();

                        if (selectedTime < currentTime) {
                            errorMessage = 'Cannot schedule presentations in the past';
                        }
                    }
                }
                break;

            case 'location':
                if (!value) {
                    errorMessage = 'Location is required';
                } else if (value === 'Other' && !formData.customLocation?.trim()) {
                    validateField('customLocation', formData.customLocation || '');
                }
                break;

            case 'customLocation':
                if (formData.location === 'Other' && !value.trim()) {
                    errorMessage = 'Custom location is required';
                }
                break;

            case 'duration':
                if (!value) {
                    errorMessage = 'Duration is required';
                } else if (Number(value) <= 0) {
                    errorMessage = 'Duration must be greater than 0';
                } else if (Number(value) > 180) {
                    errorMessage = 'Duration cannot exceed 3 hours (180 minutes)';
                }
                break;

            case 'subjectName':
                if (!value.trim()) {
                    errorMessage = 'Subject name is required';
                } else if (value.trim().length < 3) {
                    errorMessage = 'Subject name must be at least 3 characters';
                }
                break;

            default:
                break;
        }

        // Update errors state for this field
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage || null
        }));

        return !errorMessage;
    };

    // Validate form
    const validateForm = () => {
        // Validate all fields
        const groupIdValid = validateField('groupId', formData.groupId);
        const examinerNameValid = validateField('examinerName', formData.examinerName);
        const examinerEmailValid = validateField('examinerEmail', formData.examinerEmail);
        const dateValid = validateField('date', formData.date);
        const timeValid = validateField('time', formData.time);
        const locationValid = validateField('location', formData.location);
        const durationValid = validateField('duration', formData.duration);
        const subjectNameValid = validateField('subjectName', formData.subjectName);

        // If location is "Other", validate custom location
        let customLocationValid = true;
        if (formData.location === 'Other') {
            customLocationValid = validateField('customLocation', formData.customLocation);
        }

        return groupIdValid && examinerNameValid && examinerEmailValid &&
            dateValid && timeValid && locationValid &&
            durationValid && subjectNameValid && customLocationValid;
    };

    // Handle form submissionF
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a copy of the form data for submission
        const submissionData = { ...formData };

        // If "Other" is selected for location, use the custom location value
        if (formData.location === 'Other' && formData.customLocation) {
            submissionData.location = formData.customLocation;
        }

        // Remove the customLocation field before submitting
        if ('customLocation' in submissionData) {
            delete submissionData.customLocation;
        }

        if (validateForm()) {
            onSubmit(submissionData);
        } else {
            toast.error('Please fix the errors in the form');
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (confirmDelete) {
            onDelete();
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                    {/* Group ID */}
                    <div>
                        <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                            Group ID
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="groupId"
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border ${errors.groupId ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter group ID"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {errors.groupId ? (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {errors.groupId && <p className="mt-1 text-sm text-red-600">{errors.groupId}</p>}
                    </div>

                    {/* Examiner Name */}
                    <div>
                        <label htmlFor="examinerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Examiner Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="examinerName"
                                name="examinerName"
                                value={formData.examinerName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border ${errors.examinerName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter examiner name"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {errors.examinerName ? (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {errors.examinerName && <p className="mt-1 text-sm text-red-600">{errors.examinerName}</p>}
                    </div>

                    {/* Examiner Email */}
                    <div>
                        <label htmlFor="examinerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Examiner Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="examinerEmail"
                                name="examinerEmail"
                                value={formData.examinerEmail}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border ${errors.examinerEmail ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter examiner email"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {errors.examinerEmail ? (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {errors.examinerEmail && <p className="mt-1 text-sm text-red-600">{errors.examinerEmail}</p>}
                    </div>

                    {/* Subject Name */}
                    <div>
                        <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="subjectName"
                                name="subjectName"
                                value={formData.subjectName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border ${errors.subjectName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter subject name"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {errors.subjectName ? (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {errors.subjectName && <p className="mt-1 text-sm text-red-600">{errors.subjectName}</p>}
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-md border ${errors.date ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none`}
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <div className="relative">
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-md border ${errors.time ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none`}
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                        </div>
                    </div>

                    {/* Duration and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="5"
                                    step="5"
                                    className={`w-full px-4 py-2.5 rounded-md border ${errors.duration ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <select
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (e.target.value === 'Other') {
                                            setShowCustomLocation(true);
                                        } else {
                                            setShowCustomLocation(false);
                                        }
                                    }}
                                    className={`w-full px-4 py-2.5 rounded-md border ${errors.location ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                                >
                                    <option value="">Select location</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}

                            {/* Custom Location Field with Animation */}
                            {showCustomLocation && (
                                <div className="mt-2 transition-all duration-300 ease-in-out">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="customLocation"
                                            name="customLocation"
                                            value={formData.customLocation || ''}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-md border ${errors.customLocation ? 'border-red-500' : formData.customLocation ? 'border-green-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-blue-50`}
                                            placeholder="Enter custom location"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            {errors.customLocation ? (
                                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    {errors.customLocation && <p className="mt-1 text-sm text-red-600">{errors.customLocation}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <div className="flex gap-4">
                            {statusOptions.map(status => (
                                <label key={status} className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter presentation description"
                        />
                    </div>
                </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {onDelete && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${confirmDelete
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
                            }`}
                    >
                        {confirmDelete ? 'Confirm Delete' : 'Delete'}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        formData.id ? 'Update Presentation' : 'Schedule Presentation'
                    )}
                </button>
            </div>
        </form>
    );
};

export default PresentationForm;