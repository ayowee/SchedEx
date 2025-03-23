import React from 'react';

const Ureports = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Reports</h1>

      {/* User Activity Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Activity Overview</h2>
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          
        </div>
      </div>

      {/* Role-Based Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Distribution by Role</h2>
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          
        </div>
      </div>

      {/* System Usage Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">System Usage</h2>
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          
        </div>
      </div>
    </div>
  );
};

export default Ureports;