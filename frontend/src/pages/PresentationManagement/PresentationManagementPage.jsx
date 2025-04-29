import { useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PresentationForm from '../../components/forms/PresentationForm';
import PresentationTable from '../../components/presentationManagement/Presentation/PresentationTable';
import SchedExLogo from '../../assets/Logo.png';
import { presentationService } from '../../services/api';

const PresentationManagementPage = () => {
    // State management
    const [presentations, setPresentations] = useState([]);
    const [editingPresentation, setEditingPresentation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    const [statusFilter, setStatusFilter] = useState('All');

    // Fetch presentations from API on component mount
    useEffect(() => {
        fetchPresentations();
    }, []);

    const fetchPresentations = async () => {
        setIsLoading(true);
        try {
            const data = await presentationService.getAllPresentations();
            setPresentations(data);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            toast.error('Failed to load presentations. Please try again later.');
            // If API fails, use empty array
            setPresentations([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort presentations
    const filteredPresentations = useMemo(() => {
        const filtered = presentations.filter(pres => {
            const matchesSearch = 
                (pres.groupId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (pres.subjectName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (pres.examinerName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || pres.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [presentations, searchTerm, sortConfig, statusFilter]);

    // Stats for dashboard cards
    const stats = useMemo(() => {
        const total = presentations.length;
        const scheduled = presentations.filter(p => p.status === 'Scheduled').length;
        const completed = presentations.filter(p => p.status === 'Completed').length;
        const cancelled = presentations.filter(p => p.status === 'Cancelled').length;
        
        return { total, scheduled, completed, cancelled };
    }, [presentations]);

    // CRUD operations
    const addPresentation = async (presentation) => {
        setIsLoading(true);
        try {
            if (editingPresentation) {
                // Update existing presentation
                await presentationService.updatePresentation(editingPresentation._id, presentation);
                toast.success('Presentation updated successfully!');
            } else {
                // Create new presentation
                await presentationService.createPresentation(presentation);
                toast.success('Presentation created successfully!');
            }
            // Refresh the presentations list
            fetchPresentations();
        } catch (err) {
            console.error('Error saving presentation:', err);
            toast.error('Error saving presentation');
        } finally {
            setIsLoading(false);
            setShowForm(false);
            setEditingPresentation(null);
        }
    };

    const editPresentation = (id) => {
        const presentationToEdit = presentations.find(p => p._id === id);
        setEditingPresentation(presentationToEdit);
        setShowForm(true);
        
        // Scroll to form
        setTimeout(() => {
            const formElement = document.getElementById('presentation-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const deletePresentation = async (id) => {
        try {
            setIsLoading(true);
            await presentationService.deletePresentation(id);
            toast.success('Presentation deleted successfully!');
            // Refresh the presentations list
            fetchPresentations();
        } catch (err) {
            console.error('Error deleting presentation:', err);
            toast.error('Error deleting presentation');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            setIsLoading(true);
            await presentationService.updatePresentationStatus(id, newStatus);
            toast.success(`Presentation marked as ${newStatus}`);
            // Refresh the presentations list
            fetchPresentations();
        } catch (err) {
            console.error('Error updating presentation status:', err);
            toast.error('Error updating presentation status');
        } finally {
            setIsLoading(false);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // PDF Report Generation
    const generateReport = () => {
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Company logo configuration
            const logoConfig = {
                url: SchedExLogo, // Logo URL
                type: 'PNG', // Image type
                x: 130, // X position
                y: 25, // Y position
                width: 45, // Logo width
                height: 7.5 // Logo height
            };

            // Report title and header
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Scheduled Presentation Details', 150, 45, { align: 'center' });

            // Report metadata
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`Report Generated: ${new Date().toLocaleString()}`, 150, 52, { align: 'center' });
            doc.text(`Total Presentations: ${presentations.length}`, 150, 57, { align: 'center' });

            // Add company logo
            doc.addImage(
                logoConfig.url,
                logoConfig.type,
                logoConfig.x,
                logoConfig.y,
                logoConfig.width,
                logoConfig.height,
                {align: 'left'}
            );

            // Table columns
            const headers = [['Group ID', 'Examiner', 'Date', 'Time', 'Location', 'Duration', 'Subject', 'Status', 'Description']];

            // Table data
            const data = presentations.map(pres => [
                pres.groupId,
                `${pres.examinerName} (${pres.examinerId})`,
                new Date(pres.date).toLocaleDateString(),
                pres.time,
                pres.location,
                `${pres.duration} mins`,
                pres.subjectName,
                pres.status,
                pres.description || '-'
            ]);

            // Generate the table
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 70,
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    halign: 'center',
                    valign: 'middle'
                },
                headStyles: {
                    fillColor: [41, 128, 185], // Nice blue color
                    textColor: 255,
                    fontSize: 12,
                    halign: 'center',
                    valign: 'middle',
                    font: 'inter',
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 15 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 25 },
                    7: { cellWidth: 20 },
                    8: { cellWidth: 'auto' }
                },
                margin: { left: 10, right: 10 },
                didDrawPage: (data) => {
                    // Footer
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text(
                        `Page ${data.pageCount}`,
                        doc.internal.pageSize.getWidth() / 2,
                        doc.internal.pageSize.getHeight() - 10,
                        { align: 'center' }
                    );
                }
            });

            // Save the PDF
            doc.save(`scheduled presentations report.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
            toast.error('Failed to generate report');
        }
    };
    return (
        <>
            <div className="max-w-7xl mx-auto">
                {/* Header and Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Presentation Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all scheduled presentations</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500">Total Presentations</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-500">Scheduled</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduled}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                        <p className="text-sm font-medium text-gray-500">Cancelled</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search presentations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setStatusFilter('All')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        statusFilter === 'All' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setStatusFilter('Scheduled')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        statusFilter === 'Scheduled' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Scheduled
                                </button>
                                <button 
                                    onClick={() => setStatusFilter('Completed')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        statusFilter === 'Completed' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Completed
                                </button>
                                <button 
                                    onClick={() => setStatusFilter('Cancelled')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        statusFilter === 'Cancelled' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Cancelled
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={generateReport}
                                disabled={presentations.length === 0 || isLoading}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export
                            </button>
                            
                            <button
                                onClick={() => {
                                    setEditingPresentation(null);
                                    setShowForm(true);
                                }}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Schedule New
                            </button>
                        </div>
                    </div>
                </div>

                {/* Presentation Table */}
                <PresentationTable
                    presentations={filteredPresentations}
                    onEdit={editPresentation}
                    onDelete={deletePresentation}
                    onStatusChange={updateStatus}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    isLoading={isLoading}
                />
            </div>
            
            {/* Modal Form Popup */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center border-b px-6 py-4 bg-blue-50 sticky top-0">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingPresentation ? "Edit Presentation" : "Schedule New Presentation"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingPresentation(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
                                disabled={isLoading}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <PresentationForm
                                onSubmit={addPresentation}
                                editingPresentation={editingPresentation}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingPresentation(null);
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default PresentationManagementPage;