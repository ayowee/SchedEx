// src/pages/ActiveUsers.jsx
import React, { useState } from 'react';
import UserTable from '../../components/userManagement/UserTable';

const ActiveUsers = () => {
  // Dummy data for active users
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      userType: "student",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      userType: "examiner",
    },
    {
      id: 3,
      fullName: "Alice Johnson",
      email: "alice.johnson@example.com",
      userType: "student",
    },
    {
      id: 4,
      fullName: "Bob Brown",
      email: "bob.brown@example.com",
      userType: "superadmin",
    },
    {
      id: 5,
      fullName: "Charlie Davis",
      email: "charlie.davis@example.com",
      userType: "examiner",
    },
    {
      id: 6,
      fullName: "Eve White",
      email: "eve.white@example.com",
      userType: "student",
    },
  ]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full"> {/* Full width container */}
      <h1 className="text-3xl font-bold mb-8 text-black">Active Users</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, email, or user type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
        />
      </div>

      {/* User Table */}
      <div className="w-full"> {/* Full width inner container */}
        <UserTable users={filteredUsers} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default ActiveUsers;