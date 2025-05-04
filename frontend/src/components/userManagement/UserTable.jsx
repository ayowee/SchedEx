import React, { useState, useMemo } from 'react';
import { UserIcon, PencilSquareIcon, TrashIcon, ArrowDownIcon, ArrowUpIcon, ArrowPathIcon, EyeIcon, XMarkIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import SchedExLogo from '../../assets/Logo.png';
import * as XLSX from 'xlsx';

const statusColors = {
  Admin: 'bg-blue-100 text-blue-700',
  Examiner: 'bg-green-100 text-green-700',
  Student: 'bg-yellow-100 text-yellow-700',
};

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
];

const generatePDF = (user) => {
  try {
    // Create new jsPDF instance
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add SchedEx logo on white background
    const logoWidth = 40;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;
    doc.addImage(SchedExLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    
    // Add title
    doc.setTextColor(59, 130, 246); // Blue-500
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('User Profile Details', pageWidth / 2, 40, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Main content section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Information', 20, 55);
    
    // Add divider line
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.line(20, 58, pageWidth - 20, 58);
    
    // Basic user details with user type at the top
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('User Type:', 20, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(user.userType, 70, 68);

    const details = [
      { label: 'Full Name', value: user.fullName },
      { label: 'NIC', value: user.nic },
      { label: 'Email', value: user.email },
      { label: 'Contact', value: user.contactNumber }
    ];
    
    details.forEach((detail, index) => {
      const y = 80 + (index * 12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${detail.label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value || 'N/A', 70, y);
    });
    
    // Permissions section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Permissions & Access', 20, 125);
    doc.line(20, 128, pageWidth - 20, 128);
    
    // Add permissions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (user.permissions && user.permissions.length > 0) {
      user.permissions.forEach((permission, index) => {
        const y = 138 + (index * 10);
        doc.text(`• ${permission}`, 25, y);
      });
    } else {
      doc.text('No permissions assigned', 25, 138);
    }
    
    // Footer
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // Gray-400
    doc.text(`Generated on ${timestamp}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    
    // Save the PDF
    doc.save(`${user.fullName.replace(/\s+/g, '_')}_profile.pdf`);
    toast.success('PDF profile generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
  }
};

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

function getAvatarColor(idx) {
  return avatarColors[idx % avatarColors.length];
}

const UserTable = ({ users = [], editUser = () => {}, deleteUser = () => {}, loading = false }) => {
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  // State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const pageSize = 10;

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || user.userType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [users, search, typeFilter]);

  // Sorting
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortField, sortDir]);

  // Pagination
  const pageCount = Math.ceil(sortedUsers.length / pageSize);
  const pagedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Export Excel with styling
  const exportToExcel = () => {
    // Prepare the data
    const header = ['Full Name', 'Email', 'User Type', 'Permissions'];
    const rows = sortedUsers.map(user => [
      user.fullName,
      user.email,
      user.userType,
      (user.permissions || []).join(', ')
    ]);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    // Set column widths
    const colWidths = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 40 }];
    ws['!cols'] = colWidths;

    // Style the header row
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '3B82F6' } }, // Blue-500
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    // Apply header style
    for (let i = 0; i < header.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = headerStyle;
    }

    // Style the data rows
    const dataStyle = {
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      },
      alignment: { vertical: 'center' }
    };

    // Apply data style to all cells
    for (let i = 1; i <= rows.length; i++) {
      for (let j = 0; j < header.length; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = dataStyle;
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Generate Excel file
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `SchedEx_Users_${timestamp}.xlsx`);
    toast.success('Excel file generated successfully');
  };

  // Loading skeleton
  const skeletonRows = Array(pageSize).fill(0);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Admin">Admin</option>
              <option value="Examiner">Examiner</option>
              <option value="Student">Student</option>
            </select>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-sm font-medium transition"
              aria-label="Export users as Excel"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left min-w-[600px]" role="table">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('fullName')} scope="col">
                <span className="flex items-center gap-1">
                  Name
                  {sortField === 'fullName' && (sortDir === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline" /> : <ArrowDownIcon className="w-4 h-4 inline" />)}
                </span>
              </th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('email')} scope="col">
                <span className="flex items-center gap-1">
                  Email
                  {sortField === 'email' && (sortDir === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline" /> : <ArrowDownIcon className="w-4 h-4 inline" />)}
                </span>
              </th>
              <th className="p-3 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('userType')} scope="col">
                <span className="flex items-center gap-1">
                  Type
                  {sortField === 'userType' && (sortDir === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline" /> : <ArrowDownIcon className="w-4 h-4 inline" />)}
                </span>
              </th>
              <th className="p-3 font-semibold text-gray-600" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? skeletonRows.map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : pagedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400 text-lg">
                      <div className="flex flex-col items-center gap-2">
                        <ArrowPathIcon className="w-12 h-12 text-gray-200 mb-2" />
                        <span>No users found.</span>
                      </div>
                    </td>
                  </tr>
                )}
            {!loading && pagedUsers.map((user, idx) => (
              <tr
                key={user.id}
                className="transition hover:bg-blue-50 group"
                tabIndex={0}
                aria-label={`User row for ${user.fullName}`}
              >
                <td className="p-3 flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg ${getAvatarColor(idx)}`}>
                      {getInitials(user.fullName) || <UserIcon className="w-6 h-6" />}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 group-hover:text-blue-700 transition">
                    {user.fullName}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{user.email}</td>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.userType] || 'bg-gray-100 text-gray-700'}`}>
                    {user.userType}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="p-2 rounded hover:bg-green-100 text-green-600 focus:outline-none"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowViewModal(true);
                    }}
                    aria-label={`View user ${user.fullName}`}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-blue-100 text-blue-600 focus:outline-none"
                    onClick={() => {
                      setUserToUpdate(user);
                      setShowUpdateAlert(true);
                    }}
                    aria-label={`Edit user ${user.fullName}`}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-red-100 text-red-600 focus:outline-none"
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteAlert(true);
                    }}
                    aria-label={`Delete user ${user.fullName}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6" role="navigation" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
            aria-label="Previous page"
          >
            Prev
          </button>
          {[...Array(pageCount)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-2 rounded ${page === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setPage(idx + 1)}
              aria-label={`Page ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="px-3 py-2 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full max-h-[80vh] overflow-y-auto border border-gray-200">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generatePDF(selectedUser)}
                    className="p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
                    title="Download PDF"
                  >
                    <DocumentArrowDownIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${statusColors[selectedUser.userType]} shadow-lg`}>
                    {getInitials(selectedUser.fullName)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 font-medium">{selectedUser.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">NIC</label>
                    <p className="text-gray-900 font-medium">{selectedUser.nic}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900 font-medium">{selectedUser.contactNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">User Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedUser.userType]}`}>
                      {selectedUser.userType}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <label className="block text-sm font-medium text-gray-500">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission) => (
                      <span key={permission} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Alert */}
      {showDeleteAlert && userToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Delete User</h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to delete user "{userToDelete.fullName}"? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowDeleteAlert(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={() => {
                  deleteUser(userToDelete);
                  setShowDeleteAlert(false);
                  setUserToDelete(null);
                  toast.success('User deleted successfully');
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Alert */}
      {showUpdateAlert && userToUpdate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4">
              <PencilSquareIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Update User</h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to update user "{userToUpdate.fullName}"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowUpdateAlert(false);
                  setUserToUpdate(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  editUser(userToUpdate);
                  setShowUpdateAlert(false);
                  setUserToUpdate(null);
                  setShowUpdateSuccess(true);
                  setTimeout(() => setShowUpdateSuccess(false), 3000);
                  toast.success('User updated successfully');
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Success Message */}
      {showUpdateSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          User updated successfully!
        </div>
      )}
    </div>
  );
};

export default UserTable;