// PresentationTable.jsx
const PresentationTable = ({ presentations, onEdit, onDelete, onStatusChange, sortConfig, requestSort, isLoading }) => {
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

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('groupId')}
                            >
                                Group ID{getSortIndicator('groupId')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Examiner
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('date')}
                            >
                                Date & Time{getSortIndicator('date')}
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
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('status')}
                            >
                                Status{getSortIndicator('status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {presentations.length > 0 ? (
                            presentations.map((presentation) => (
                                <tr key={presentation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {presentation.groupId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-medium">{presentation.examinerName}</div>
                                        <div className="text-gray-500 text-xs">{presentation.examinerId}</div>
                                        <div className="text-gray-500 text-xs">{presentation.examinerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>{new Date(presentation.date).toLocaleDateString()}</div>
                                        <div className="text-gray-500">{presentation.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {presentation.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {presentation.duration} mins
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="max-w-xs truncate">{presentation.subjectName}</div>
                                        <div className="text-gray-500 text-xs max-w-xs truncate">
                                            {presentation.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <StatusBadge status={presentation.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col space-y-2">
                                            {/* Status change dropdown */}
                                            <div className="relative inline-block text-left">
                                                <select 
                                                    className="block w-full pl-3 pr-10 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={presentation.status}
                                                    onChange={(e) => onStatusChange(presentation.id, e.target.value)}
                                                    disabled={isLoading}
                                                >
                                                    <option value="Scheduled">Scheduled</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            
                                            {/* Action buttons */}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => onEdit(presentation.id)}
                                                    className="inline-flex items-center justify-center p-1 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none"
                                                    disabled={isLoading}
                                                    title="Edit presentation"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(presentation.id)}
                                                    className="inline-flex items-center justify-center p-1 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none"
                                                    disabled={isLoading}
                                                    title="Delete presentation"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center p-1 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none"
                                                    title="View details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {isLoading ? "Loading..." : "No presentations found"}
                                </td>
                            </tr>
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
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                    1
                                </a>
                                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresentationTable;