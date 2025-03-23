import { useState } from "react";
import UserForm from "../components/UserForm";

const UserManagement = () => {
  // Initialize state with dummy data
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "Hima Alahakoon",
      nic: "200274563425",
      email: "hima@gmail.com",
      contactNumber: "712345678",
      userType: "student",
      permissions: ["View Timetable"],
    },
    {
      id: 2,
      fullName: "Nethmini Yasara",
      nic: "987654321V",
      email: "yasarav@gmail.com",
      contactNumber: "723456789",
      userType: "examiner",
      permissions: ["Reschedule Requests", "Add Time Slots"],
    },
    {
      id: 3,
      fullName: "Amal de Silva",
      nic: "908976897V",
      email: "amal@gamil.com",
      contactNumber: "734567890",
      userType: "superadmin",
      permissions: ["Create Users", "View Timetable", "Reschedule Requests", "Manage Time Slots", "Add Time Slots", "Delete Users"],
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(true); // Show form in the center initially
  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Add or update a user
  const addUser = (user) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...user, id: editingUser.id } : u)));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...user, id: users.length + 1 }]);
    }
    setFormSubmitted(true); // Mark form as submitted
    setShowForm(false); // Hide the form after submission
  };

  // Delete a user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Edit a user
  const editUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setShowForm(true); // Show the form when editing
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for User Form (visible after submission) */}
      {formSubmitted && (
        <div
          className={`fixed inset-y-0 left-0 transform ${showForm ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg z-50 p-4`}
        >
          <UserForm addUser={addUser} editingUser={editingUser} />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all duration-300 ease-in-out ${formSubmitted && showForm ? "ml-64" : "ml-0"}`}>
        {/* Button to toggle the form */}
        {formSubmitted && (
          <div className="flex justify-start mb-4"> {/* Flex container to align button to the left */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              {showForm ? "Hide Form" : "Show Form"}
            </button>
          </div>
        )}

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
        {filteredUsers.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">User List</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300 text-gray-800">Full Name</th>
                  <th className="p-2 border border-gray-300 text-gray-800">NIC</th>
                  <th className="p-2 border border-gray-300 text-gray-800">Email</th>
                  <th className="p-2 border border-gray-300 text-gray-800">Contact</th>
                  <th className="p-2 border border-gray-300 text-gray-800">User Type</th>
                  <th className="p-2 border border-gray-300 text-gray-800">Permissions</th>
                  <th className="p-2 border border-gray-300 text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border border-gray-300">
                    <td className="p-2 border border-gray-300 text-gray-800">{user.fullName}</td>
                    <td className="p-2 border border-gray-300 text-gray-800">{user.nic}</td>
                    <td className="p-2 border border-gray-300 text-gray-800">{user.email}</td>
                    <td className="p-2 border border-gray-300 text-gray-800">{user.contactNumber}</td>
                    <td className="p-2 border border-gray-300 text-gray-800">{user.userType}</td>
                    <td className="p-2 border border-gray-300 text-gray-800">{user.permissions.join(", ")}</td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex space-x-2"> {/* Flex container for buttons */}
                        <button
                          onClick={() => editUser(user.id)}
                          className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Initial Create User Form (centered on the page) */}
        {!formSubmitted && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
              <UserForm addUser={addUser} editingUser={editingUser} />
            </div>
          </div>
        )}

{formSubmitted && (
  <div
  className={`fixed inset-y-0 left-0 transform ${
    showForm ? "translate-x-0" : "-translate-x-full"
  } transition-transform duration-300 ease-in-out w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto scroll-smooth`}
>
  {/* Close Button */}
  <button
  onClick={() => setShowForm(false)}
  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 text-sm"
>
  ✕
</button>

  <UserForm addUser={addUser} editingUser={editingUser} isSidebar={true} />
</div>
)}
      </div>
    </div>
  );
};

export default UserManagement;