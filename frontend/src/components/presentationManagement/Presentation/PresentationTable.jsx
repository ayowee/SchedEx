// PresentationTable.jsx
import React, { useState } from 'react';

const PresentationTable = ({ presentations, onEdit, onDelete, sortConfig, requestSort, isLoading }) => {
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return null;
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        let bgColor = '';
        let textColor = '';
        
        switch(status) {
            case 'Scheduled':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'Completed':
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                break;
            case 'Cancelled':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
        }
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    // View details modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPresentation, setSelectedPresentation] = useState(null);
    
    // Delete confirmation modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [presentationToDelete, setPresentationToDelete] = useState(null);

    // Handle view details
    const handleViewDetails = (presentation) => {
        setSelectedPresentation(presentation);
        setViewModalOpen(true);
    };

    // Handle delete confirmation
    const handleDeleteClick = (presentation) => {
        setPresentationToDelete(presentation);
        setDeleteModalOpen(true);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => requestSort('groupId')}
                                >
                                    <div className="flex items-center">
                                        Group ID
                                        <span className="ml-1 text-gray-400">{getSortIndicator('groupId')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Examiner
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => requestSort('date')}
                                >
                                    <div className="flex items-center">
                                        Date & Time
                                        <span className="ml-1 text-gray-400">{getSortIndicator('date')}</span>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Loading presentations...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : presentations.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No presentations found
                                    </td>
                                </tr>
                            ) : (
                                presentations.map((presentation) => (
                                    <tr 
                                        key={presentation._id} 
                                        className="hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {presentation.groupId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="font-medium">{presentation.examinerName}</div>
                                            <div className="text-xs text-gray-500">{presentation.examinerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div>{new Date(presentation.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">{presentation.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {presentation.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {presentation.duration} min
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {presentation.subjectName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <StatusBadge status={presentation.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button 
                                                    onClick={() => onEdit(presentation._id)}
                                                    className="text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                    aria-label="Edit"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(presentation)}
                                                    className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                    aria-label="Delete"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleViewDetails(presentation)}
                                                    className="text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                                    aria-label="View Details"
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination placeholder */}
                {presentations.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Previous
                            </a>
                            <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Next
                            </a>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{presentations.length}</span> of{' '}
                                    <span className="font-medium">{presentations.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        1
                                    </a>
                                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && presentationToDelete && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
                        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete the presentation for group <span className="font-semibold">{presentationToDelete.groupId}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(presentationToDelete._id);
                                    setDeleteModalOpen(false);
                                    setPresentationToDelete(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModalOpen && selectedPresentation && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto transform transition-all duration-300 ease-in-out">
                        <div className="flex justify-between items-center border-b px-6 py-4 bg-blue-50 sticky top-0">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Presentation Details
                            </h2>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1 transition-colors duration-200"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Group ID</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.groupId}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Examiner</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.examinerName}</p>
                                        <p className="text-xs text-gray-500">{selectedPresentation.examinerEmail}</p>
                                        <p className="text-xs text-gray-500">ID: {selectedPresentation.examinerId}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {new Date(selectedPresentation.date).toLocaleDateString()} at {selectedPresentation.time}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.location}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.subjectName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.duration} minutes</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                        <div className="mt-1">
                                            <StatusBadge status={selectedPresentation.status} />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPresentation.description || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PresentationTable;