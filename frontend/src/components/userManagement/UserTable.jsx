import React, { useState, useMemo } from 'react';
import { UserIcon, PencilSquareIcon, TrashIcon, ArrowDownIcon, ArrowUpIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

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
  // State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
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

  // Export CSV
  const exportCSV = () => {
    const header = ['Full Name', 'Email', 'Type'];
    const rows = sortedUsers.map((u) => [u.fullName, u.email, u.userType]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'users.csv';
    a.click();
  };

  // Loading skeleton
  const skeletonRows = Array(pageSize).fill(0);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg" aria-label="User Table">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className="text-2xl font-bold text-gray-900">User List</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Search users"
          />
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Filter by user type"
          >
            <option value="All">All Types</option>
            <option value="Admin">Admin</option>
            <option value="Examiner">Examiner</option>
            <option value="Student">Student</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-sm font-medium transition"
            aria-label="Export users as CSV"
          >
            Export CSV
          </button>
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
                  <tr key={idx}>
                    <td className="p-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
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
                    className="p-2 rounded hover:bg-blue-100 text-blue-600 focus:outline-none"
                    onClick={() => editUser(user)}
                    aria-label={`Edit user ${user.fullName}`}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-red-100 text-red-600 focus:outline-none"
                    onClick={() => deleteUser(user)}
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
    </div>
  );
};

export default UserTable;