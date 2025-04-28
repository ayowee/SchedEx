import { useState, useEffect } from "react";
import { UserIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const UserForm = ({ addUser, editingUser, isSidebar }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    contactNumber: "",
    userType: "",
    permissions: [],
  });

  const [nicError, setNicError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    const nicRegex = /^(\d{12}|\d{9}[Vv])$/;
    return nicRegex.test(nic);
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate contact number
  const validateContact = (contact) => {
    const contactRegex = /^\d{10}$/;
    return contactRegex.test(contact);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, value]
          : prev.permissions.filter((perm) => perm !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormTouched(true);
  };

  // Validate on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "nic") setNicError(validateNIC(value) ? "" : "Invalid NIC format");
    if (name === "email") setEmailError(validateEmail(value) ? "" : "Invalid email");
    if (name === "contactNumber") setContactError(validateContact(value) ? "" : "Invalid contact number");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    // Final validation
    setNicError(validateNIC(formData.nic) ? "" : "Invalid NIC format");
    setEmailError(validateEmail(formData.email) ? "" : "Invalid email");
    setContactError(validateContact(formData.contactNumber) ? "" : "Invalid contact number");
    if (
      formData.fullName &&
      validateNIC(formData.nic) &&
      validateEmail(formData.email) &&
      validateContact(formData.contactNumber) &&
      formData.userType
    ) {
      try {
        await addUser(formData);
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          nic: "",
          email: "",
          contactNumber: "",
          userType: "",
          permissions: [],
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError('Failed to save user. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // User types
  const userTypes = ["Admin", "Examiner", "Student"];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8"
    >
      {/* Avatar/Icon */}
      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <UserIcon className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>
      </div>

      {/* User Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            NIC
            {nicError ? (
              <ExclamationCircleIcon className="w-4 h-4 text-red-500 ml-1" />
            ) : nicError === "" && formData.nic && (
              <CheckCircleIcon className="w-4 h-4 text-green-500 ml-1" />
            )}
          </label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 rounded-md border ${nicError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="NIC (e.g. 123456789V or 200012345678)"
            required
          />
          {nicError && <p className="text-xs text-red-500 mt-1">{nicError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Email
            {emailError ? (
              <ExclamationCircleIcon className="w-4 h-4 text-red-500 ml-1" />
            ) : emailError === "" && formData.email && (
              <CheckCircleIcon className="w-4 h-4 text-green-500 ml-1" />
            )}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 rounded-md border ${emailError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter email"
            required
          />
          {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Contact Number
            {contactError ? (
              <ExclamationCircleIcon className="w-4 h-4 text-red-500 ml-1" />
            ) : contactError === "" && formData.contactNumber && (
              <CheckCircleIcon className="w-4 h-4 text-green-500 ml-1" />
            )}
          </label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 rounded-md border ${contactError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter 10-digit contact number"
            required
          />
          {contactError && <p className="text-xs text-red-500 mt-1">{contactError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select user type</option>
            {userTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {permissionsList.map((perm) => (
            <label key={perm} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="permissions"
                value={perm}
                checked={formData.permissions.includes(perm)}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{perm}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      {submitError && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="p-3 rounded bg-green-50 border border-green-200 text-green-600 text-sm">
          User saved successfully!
        </div>
      )}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
        <button
          type="button"
          className="px-5 py-2.5 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          onClick={() => setFormData({
            fullName: "",
            nic: "",
            email: "",
            contactNumber: "",
            userType: "",
            permissions: [],
          })}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition"
        >
          {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;