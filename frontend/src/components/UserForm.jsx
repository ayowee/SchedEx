import { useState, useEffect } from "react";

const UserForm = ({ addUser, editingUser, isSidebar }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    contactNumber: "",
    userType: "",
    permissions: [],
  });

  const [nicError, setNicError] = useState(""); // State to store NIC validation error
  const [emailError, setEmailError] = useState(""); // State to store email validation error
  const [contactError, setContactError] = useState(""); // State to store contact number validation error

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      setFormData({
        fullName: "",
        nic: "",
        email: "",
        contactNumber: "",
        userType: "",
        permissions: [],
      });
    }
  }, [editingUser]);

  const permissionsList = [
    "Create Users",
    "View Timetable",
    "Reschedule Requests",
    "Manage Time Slots",
    "Add Time Slots",
    "Delete Users",
  ];

  // Validate NIC number
  const validateNIC = (nic) => {
    const nicRegex = /^(\d{12}|\d{9}[Vv])$/; // Regex for 12 digits or 9 digits + 'V'
    return nicRegex.test(nic);
  };

  // Validate email (only allows @ as a special character)
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate contact number (9 digits)
  const validateContactNumber = (contactNumber) => {
    const contactRegex = /^\d{9}$/; // Regex for exactly 9 digits
    return contactRegex.test(contactNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate NIC on change
    if (name === "nic") {
      if (!validateNIC(value)) {
        setNicError("Invalid NIC Number");
      } else {
        setNicError("");
      }
    }

    // Validate email on change
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid Email");
      } else {
        setEmailError("");
      }
    }

    // Validate contact number on change
    if (name === "contactNumber") {
      if (!validateContactNumber(value)) {
        setContactError("Contact number must be exactly 9 digits.");
      } else {
        setContactError("");
      }
    }
    

    if (name === "userType") {
      let updatedPermissions = [];
      if (value === "superadmin") {
        updatedPermissions = [...permissionsList];
      } else if (value === "student") {
        updatedPermissions = ["View Timetable"];
      } else if (value === "examiner") {
        updatedPermissions = ["Reschedule Requests", "Add Time Slots"];
      }
      setFormData((prev) => ({ ...prev, permissions: updatedPermissions }));
    }
  };

  const handleCheckboxChange = (permission) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate NIC before submission
    if (!validateNIC(formData.nic)) {
      alert("Invalid NIC Number: NIC must be 12 digits or 9 digits followed by 'V'.");
      return;
    }

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      alert("Invalid Email: Email must contain only '@' as a special character.");
      return;
    }

    // Validate contact number before submission
    if (!validateContactNumber(formData.contactNumber)) {
      alert("Invalid Contact Number: Contact number must be exactly 9 digits.");
      return;
    }

    if (!formData.fullName || !formData.nic || !formData.email || !formData.contactNumber || !formData.userType) {
      alert("All fields are required!");
      return;
    }

    addUser(formData);
    alert(editingUser ? "User updated successfully!" : "User created successfully!");
    setFormData({
      fullName: "",
      nic: "",
      email: "",
      contactNumber: "",
      userType: "",
      permissions: [],
    });
    setNicError(""); // Clear NIC error after submission
    setEmailError(""); // Clear email error after submission
    setContactError(""); // Clear contact number error after submission
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">{editingUser ? "Edit User" : "Create User"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            placeholder="NIC"
            className={`w-full p-2 border ${nicError ? "border-red-500" : "border-gray-300"} rounded`}
            required
          />
          {nicError && <p className="text-red-500 text-sm text-left mt-1">{nicError}</p>} {/* Left-aligned NIC error */}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (eg: abc@gmail.com)"
            className={`w-full p-2 border ${emailError ? "border-red-500" : "border-gray-300"} rounded`}
            required
          />
          {emailError && <p className="text-red-500 text-sm text-left mt-1">{emailError}</p>} {/* Left-aligned email error */}
        </div>

        <div>
          <div className="flex">
            <div className="w-20 p-2 border border-gray-300 rounded-l bg-gray-100 flex items-center justify-center">
              +94
            </div>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number (eg:713553696)"
              className={`${isSidebar ? "w-32" : "w-full"} p-2 border ${contactError ? "border-red-500" : "border-gray-300"} rounded-r`}
              required
            />
          </div>
          {contactError && <p className="text-red-500 text-sm text-left mt-1">{contactError}</p>} {/* Left-aligned contact error */}
        </div>

        <div>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="examiner">Examiner</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div className="space-y-2">
          {permissionsList.map((permission) => (
            <label key={permission} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => handleCheckboxChange(permission)}
                className="mr-2"
              />
              {permission}
            </label>
          ))}
        </div>

        <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded">
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;