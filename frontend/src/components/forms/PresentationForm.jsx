import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PresentationForm = ({ initialValues, onSubmit, onDelete, isLoading }) => {
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
        subjectName: '',
        description: '',
        status: 'Scheduled'
    });
    
    const [errors, setErrors] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Locations for dropdown
    const locations = ['Room A101', 'Room B205', 'Room C310', 'Conference Hall', 'Online'];
    
    // Status options
    const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

    // Update form data when initialValues change
    useEffect(() => {
        if (initialValues) {
            setFormData(prevData => ({
                ...prevData,
                ...initialValues
            }));
        }
    }, [initialValues]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error for this field if exists
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.groupId.trim()) newErrors.groupId = 'Group ID is required';
        if (!formData.examinerName.trim()) newErrors.examinerName = 'Examiner name is required';
        if (!formData.examinerEmail.trim()) {
            newErrors.examinerEmail = 'Examiner email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.examinerEmail)) {
            newErrors.examinerEmail = 'Invalid email format';
        }
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.duration || formData.duration <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }
        if (!formData.subjectName.trim()) newErrors.subjectName = 'Subject name is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
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
                        <input
                            type="text"
                            id="groupId"
                            name="groupId"
                            value={formData.groupId}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${errors.groupId ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter group ID"
                        />
                        {errors.groupId && <p className="mt-1 text-sm text-red-600">{errors.groupId}</p>}
                    </div>

                    {/* Examiner Name */}
                    <div>
                        <label htmlFor="examinerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Examiner Name
                        </label>
                        <input
                            type="text"
                            id="examinerName"
                            name="examinerName"
                            value={formData.examinerName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${errors.examinerName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter examiner name"
                        />
                        {errors.examinerName && <p className="mt-1 text-sm text-red-600">{errors.examinerName}</p>}
                    </div>

                    {/* Examiner Email */}
                    <div>
                        <label htmlFor="examinerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Examiner Email
                        </label>
                        <input
                            type="email"
                            id="examinerEmail"
                            name="examinerEmail"
                            value={formData.examinerEmail}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${errors.examinerEmail ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter examiner email"
                        />
                        {errors.examinerEmail && <p className="mt-1 text-sm text-red-600">{errors.examinerEmail}</p>}
                    </div>

                    {/* Subject Name */}
                    <div>
                        <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name
                        </label>
                        <input
                            type="text"
                            id="subjectName"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-md border ${errors.subjectName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter subject name"
                        />
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
                                    className={`w-full px-4 py-2.5 rounded-md border ${errors.date ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none`}
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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
                                    className={`w-full px-4 py-2.5 rounded-md border ${errors.time ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none`}
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
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
                            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border ${errors.location ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            >
                                <option value="">Select location</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
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
                        className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            confirmDelete 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
                        }`}
                    >
                        {confirmDelete ? 'Confirm Delete' : 'Delete'}
                    </button>
                )}
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