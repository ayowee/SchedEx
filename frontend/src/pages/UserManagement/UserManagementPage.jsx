import React, { useState, useEffect, useMemo } from "react";
import UserForm from "../../components/userManagement/UserForm";
import UserTable from "../../components/userManagement/UserTable";
import { userService } from "../../services/api";

import UserMetrics from "../../components/userManagement/Dashboard/UserMetrics";
import UserCharts from "../../components/userManagement/Dashboard/UserCharts";
import UserRecentActivity from "../../components/userManagement/Dashboard/UserRecentActivity";

const USER_TYPE_COLORS = {
  Admin: '#2563EB',
  Examiner: '#10B981',
  Student: '#F59E42',
};

const initialUsers = [
  {
    id: 1,
    fullName: "Hima Alahakoon",
    nic: "200274563425",
    email: "hima@gmail.com",
    contactNumber: "712345678",
    userType: "Student",
    permissions: ["View Timetable"],
  },
  {
    id: 2,
    fullName: "Nethmini Yasara",
    nic: "987654321V",
    email: "yasarav@gmail.com",
    contactNumber: "723456789",
    userType: "Examiner",
    permissions: ["Reschedule Requests", "Add Time Slots"],
  },
  {
    id: 3,
    fullName: "Sithum Suraweera",
    nic: "200116500681",
    email: "suraweera01work@gamil.com",
    contactNumber: "763416700",
    userType: "Admin",
    permissions: ["Create Users", "View Timetable", "Reschedule Requests", "Manage Time Slots", "Add Time Slots", "Delete Users"],
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform user data for charts
  const userTypeData = useMemo(() => {
    const userTypes = users.reduce((acc, user) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(userTypes).map(([type, value]) => ({
      type,
      value,
      color: USER_TYPE_COLORS[type] || '#CBD5E1'
    }));
  }, [users]);

  // Fetch users from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getAllUsers();
        if (data && Array.isArray(data)) {
          setUsers(data);
        } else {
          // Fallback to initial users if API fails
          console.warn('Invalid data format from API, using initial data');
          setUsers(initialUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.error || 'Error fetching users');
        // Fallback to initial users if API fails
        setUsers(initialUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);

  // Add or update a user
  const addUser = async (user) => {
    try {
      if (editingUser) {
        const updatedUser = await userService.updateUser(editingUser._id, user);
        setUsers(users.map((u) => (u._id === editingUser._id ? updatedUser : u)));
        setRecentActivity([
          {
            id: Date.now(),
            user: { name: user.fullName, avatar: user.fullName[0], color: 'bg-blue-500' },
            action: 'updated user',
            subject: user.email,
            time: 'Just now',
          },
          ...recentActivity,
        ]);
        setEditingUser(null);
      } else {
        const newUser = await userService.createUser(user);
        setUsers([...users, newUser]);
        setRecentActivity([
          {
            id: Date.now(),
            user: { name: user.fullName, avatar: user.fullName[0], color: 'bg-green-500' },
            action: 'added user',
            subject: user.email,
            time: 'Just now',
          },
          ...recentActivity,
        ]);
      }
      setFormSubmitted(true);
      setShowForm(false);
      setError(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.error || 'Error saving user');
      throw error; // Re-throw to be caught by the form
    }
  };

  // Delete a user
  const deleteUser = async (user) => {
    try {
      await userService.deleteUser(user._id);
      setUsers(users.filter((u) => u._id !== user._id));
      setRecentActivity([
        {
          id: Date.now(),
          user: { name: user.fullName, avatar: user.fullName[0], color: 'bg-red-500' },
          action: 'deleted user',
          subject: user.email,
          time: 'Just now',
        },
        ...recentActivity,
      ]);
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.error || 'Error deleting user');
    }
  };

  // Edit a user
  const editUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Filtered users for table
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics for dashboard
  const userTypeCounts = users.reduce((acc, u) => {
    acc[u.userType] = (acc[u.userType] || 0) + 1;
    return acc;
  }, {});
  const stats = {
    total: users.length,
    active: users.length, // For demo, all users are active
    admins: userTypeCounts["Admin"] || 0,
    examiners: userTypeCounts["Examiner"] || 0,
    students: userTypeCounts["Student"] || 0,
    trends: {
      total: '+2.5%',
      totalDir: 'up',
      active: '+1.2%',
      activeDir: 'up',
      admins: '+0.0%',
      adminsDir: 'up',
      examiners: '+0.0%',
      examinersDir: 'up',
    },
  };
  // Pie chart data is now handled by the useMemo hook above


  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Dashboard Widgets */}
          <UserMetrics stats={stats} />
          <div className="flex flex-col lg:flex-row gap-8">
          <UserCharts userTypeData={userTypeData} />
          <UserRecentActivity activities={recentActivity} />
          </div>

          {/* User Management Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <button
              onClick={() => { setEditingUser(null); setShowForm(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition"
            >
              Add New User
            </button>
            <input
              type="text"
              placeholder="Search by name, email, or user type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* User Table */}
          <UserTable users={filteredUsers} editUser={editUser} deleteUser={deleteUser} />

          {/* User Form Modal/Sidebar */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-700 text-xl"
                  aria-label="Close form"
                >
                  ×
                </button>
                <UserForm addUser={addUser} editingUser={editingUser} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}