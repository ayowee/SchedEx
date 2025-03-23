// src/components/UserTable.jsx
import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">User List</h2>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">Full Name</th>
            <th className="p-2 border border-gray-300">Email</th>
            <th className="p-2 border border-gray-300">User Type</th>
            {/* Removed "Actions" column */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border border-gray-300">
              <td className="p-2 border border-gray-300">{user.fullName}</td>
              <td className="p-2 border border-gray-300">{user.email}</td>
              <td className="p-2 border border-gray-300">{user.userType}</td>
              {/* Removed "Actions" column */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;