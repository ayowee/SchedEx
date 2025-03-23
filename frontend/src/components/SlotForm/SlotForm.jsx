import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';

// Mock data for examiners and modules
const EXAMINERS = [
  { id: 'EX001', name: 'John Doe', email: 'john.doe@example.com', mobile: '0771234567' },
  { id: 'EX002', name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '0777654321' },
  { id: 'EX003', name: 'Bob Wilson', email: 'bob.wilson@example.com', mobile: '0773456789' },
];

const MODULES = [
  { id: 'MOD001', name: 'Software Engineering', specialization: 'SE' },
  { id: 'MOD002', name: 'Database Systems', specialization: 'DS' },
  { id: 'MOD003', name: 'Web Development', specialization: 'WD' },
];

const SlotForm = ({ mode = 'create', onSubmit }) => {
  const location = useLocation();
  const editData = location.state?.slotData;
  const editMode = location.state?.editMode;
  const slotIndex = location.state?.slotIndex;

  const [formData, setFormData] = useState({
    examiner: {
      id: '',
      name: '',
      email: '',
      mobile: ''
    },
    module: {
      specialization: '',
      moduleId: '',
      name: '',
      semester: ''
    },
    sessions: [{
      name: '',
      type: '',
      startTime: '',
      endTime: '',
      location: '',
      deliveryMethod: '',
      date: '',
      isActive: true
    }]
  });

  // Initialize form with edit data if available
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const [errors, setErrors] = useState({
    examiner: {},
    module: {},
    sessions: [{}]
  });

  const [touched, setTouched] = useState({
    examiner: {},
    module: {},
    sessions: [{}]
  });

  const [filteredExaminers, setFilteredExaminers] = useState(EXAMINERS);
  const [filteredModules, setFilteredModules] = useState(MODULES);

  // Handle examiner selection
  const handleExaminerChange = (field, value) => {
    if (field === 'id') {
      const examiner = EXAMINERS.find(e => e.id === value);
      if (examiner) {
        setFormData(prev => ({
          ...prev,
          examiner: {
            id: examiner.id,
            name: examiner.name,
            email: examiner.email,
            mobile: examiner.mobile
          }
        }));
        setErrors(prev => ({
          ...prev,
          examiner: {}
        }));
      } else {
        // Filter examiners based on ID or name
        const filtered = EXAMINERS.filter(e => 
          e.id.toLowerCase().includes(value.toLowerCase()) ||
          e.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredExaminers(filtered);
      }
    } else if (field === 'name') {
      const filtered = EXAMINERS.filter(e => 
        e.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExaminers(filtered);
      setFormData(prev => ({
        ...prev,
        examiner: {
          ...prev.examiner,
          name: value
        }
      }));
    }
    setTouched(prev => ({
      ...prev,
      examiner: { ...prev.examiner, [field]: true }
    }));
  };

  // Handle module selection
  const handleModuleChange = (field, value) => {
    if (field === 'moduleId') {
      const module = MODULES.find(m => m.id === value);
      if (module) {
        setFormData(prev => ({
          ...prev,
          module: {
            moduleId: module.id,
            name: module.name,
            specialization: module.specialization,
            semester: prev.module.semester
          }
        }));
        setErrors(prev => ({
          ...prev,
          module: {}
        }));
      } else {
        // Filter modules based on ID or name
        const filtered = MODULES.filter(m => 
          m.id.toLowerCase().includes(value.toLowerCase()) ||
          m.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredModules(filtered);
      }
    } else if (field === 'name') {
      const filtered = MODULES.filter(m => 
        m.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredModules(filtered);
      setFormData(prev => ({
        ...prev,
        module: {
          ...prev.module,
          name: value
        }
      }));
    } else if (field === 'semester') {
      setFormData(prev => ({
        ...prev,
        module: { ...prev.module, semester: value }
      }));
    }
    setTouched(prev => ({
      ...prev,
      module: { ...prev.module, [field]: true }
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {
      examiner: {},
      module: {},
      sessions: formData.sessions.map(() => ({}))
    };

    // Validate examiner
    if (!formData.examiner.id) newErrors.examiner.id = 'Examiner ID is required';
    if (!formData.examiner.name) newErrors.examiner.name = 'Examiner name is required';
    if (!formData.examiner.email) newErrors.examiner.email = 'Examiner email is required';

    // Validate module
    if (!formData.module.moduleId) newErrors.module.moduleId = 'Module ID is required';
    if (!formData.module.name) newErrors.module.name = 'Module name is required';
    if (!formData.module.specialization) newErrors.module.specialization = 'Specialization is required';
    if (!formData.module.semester) newErrors.module.semester = 'Semester is required';

    // Validate sessions
    formData.sessions.forEach((session, index) => {
      const sessionErrors = {};
      if (!session.name) sessionErrors.name = 'Session name is required';
      if (!session.type) sessionErrors.type = 'Session type is required';
      if (!session.startTime) sessionErrors.startTime = 'Start time is required';
      if (!session.endTime) sessionErrors.endTime = 'End time is required';
      if (!session.location) sessionErrors.location = 'Location is required';
      if (!session.deliveryMethod) sessionErrors.deliveryMethod = 'Delivery method is required';
      if (!session.date) sessionErrors.date = 'Date is required';
      newErrors.sessions[index] = sessionErrors;
    });

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors.examiner).length &&
           !Object.values(newErrors.module).length &&
           !newErrors.sessions.some(session => Object.values(session).length);
  };

  const handleSessionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      )
    }));
    setTouched(prev => ({
      ...prev,
      sessions: prev.sessions.map((session, i) =>
        i === index ? { ...session, [field]: true } : session
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      examiner: { id: true, name: true, email: true, mobile: true },
      module: { moduleId: true, name: true, specialization: true, semester: true },
      sessions: formData.sessions.map(() => ({
        name: true, type: true, startTime: true, endTime: true,
        location: true, deliveryMethod: true, date: true
      }))
    });

    if (validateForm()) {
      try {
        // Get existing slots from localStorage
        const savedSlots = localStorage.getItem('slots');
        let existingSlots = [];
        
        if (savedSlots) {
          try {
            const parsed = JSON.parse(savedSlots);
            existingSlots = Array.isArray(parsed) ? parsed : [];
          } catch (parseError) {
            console.error('Error parsing saved slots:', parseError);
            existingSlots = [];
          }
        }
        
        if (editMode) {
          // Update existing slot
          const updatedSlots = existingSlots.map((slot, index) => 
            index === slotIndex ? formData : slot
          );
          localStorage.setItem('slots', JSON.stringify(updatedSlots));
          toast.success('Slot updated successfully');
        } else {
          // Add new slot
          const newSlots = [...existingSlots, formData];
          localStorage.setItem('slots', JSON.stringify(newSlots));
          toast.success('Slot created successfully');
        }
        
        // Navigate back to the table view
        window.location.href = '/slots';
      } catch (error) {
        console.error('Error saving slot:', error);
        toast.error('Error saving slot. Please try again.');
      }
    }
  };

  // Return error display helper
  const getErrorDisplay = (section, field) => {
    if (touched[section]?.[field] && errors[section]?.[field]) {
      return (
        <p className="text-red-500 text-sm mt-1">{errors[section][field]}</p>
      );
    }
    return null;
  };

  const addSlot = () => {
    // Validate first slot before allowing to add more
    const firstSlot = formData.sessions[0];
    if (!firstSlot.name || !firstSlot.type || !firstSlot.startTime || 
        !firstSlot.endTime || !firstSlot.location || !firstSlot.deliveryMethod || 
        !firstSlot.date) {
      toast.error('Please fill all fields in the first slot before adding another');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sessions: [...prev.sessions, {
        name: prev.sessions[0].name,
        type: prev.sessions[0].type,
        deliveryMethod: prev.sessions[0].deliveryMethod,
        startTime: '',
        endTime: '',
        location: '',
        date: '',
        isActive: true
      }]
    }));
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        {/* Left Column - Examiner Info */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold pb-3 text-black border-b">Examiner Information</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Name:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.examiner.name}
                  onChange={(e) => handleExaminerChange('name', e.target.value)}
                  placeholder="Search examiner name"
                  className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    touched.examiner?.name && errors.examiner?.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {filteredExaminers.length > 0 && formData.examiner.name && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredExaminers.map(examiner => (
                      <div
                        key={examiner.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => {
                          handleExaminerChange('id', examiner.id);
                          setFilteredExaminers([]);
                        }}
                      >
                        {examiner.name}
                      </div>
                    ))}
                  </div>
                )}
                {getErrorDisplay('examiner', 'name')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Examiner ID:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.examiner.id}
                  onChange={(e) => handleExaminerChange('id', e.target.value)}
                  placeholder="Search examiner ID"
                  className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    touched.examiner?.id && errors.examiner?.id ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {filteredExaminers.length > 0 && formData.examiner.id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredExaminers.map(examiner => (
                      <div
                        key={examiner.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => {
                          handleExaminerChange('id', examiner.id);
                          setFilteredExaminers([]);
                        }}
                      >
                        {examiner.id} - {examiner.name}
                      </div>
                    ))}
                  </div>
                )}
                {getErrorDisplay('examiner', 'id')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Email:</label>
              <div>
                <input
                  type="email"
                  value={formData.examiner.email}
                  readOnly
                  className="w-full px-4 py-2.5 text-black bg-gray-100 border border-gray-300 rounded-lg"
                />
                {getErrorDisplay('examiner', 'email')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Mobile:</label>
              <div>
                <input
                  type="tel"
                  value={formData.examiner.mobile}
                  readOnly
                  className="w-full px-4 py-2.5 text-black bg-gray-100 border border-gray-300 rounded-lg"
                />
                {getErrorDisplay('examiner', 'mobile')}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Module Info */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold pb-3 text-black border-b">Module Information</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Module Name:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.module.name}
                  onChange={(e) => handleModuleChange('name', e.target.value)}
                  placeholder="Search module name"
                  className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    touched.module?.name && errors.module?.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {filteredModules.length > 0 && formData.module.name && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredModules.map(module => (
                      <div
                        key={module.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => {
                          handleModuleChange('moduleId', module.id);
                          setFilteredModules([]);
                        }}
                      >
                        {module.name}
                      </div>
                    ))}
                  </div>
                )}
                {getErrorDisplay('module', 'name')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Module ID:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.module.moduleId}
                  onChange={(e) => handleModuleChange('moduleId', e.target.value)}
                  placeholder="Search module ID"
                  className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    touched.module?.moduleId && errors.module?.moduleId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {filteredModules.length > 0 && formData.module.moduleId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredModules.map(module => (
                      <div
                        key={module.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => {
                          handleModuleChange('moduleId', module.id);
                          setFilteredModules([]);
                        }}
                      >
                        {module.id} - {module.name}
                      </div>
                    ))}
                  </div>
                )}
                {getErrorDisplay('module', 'moduleId')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Specialization:</label>
              <div>
                <input
                  type="text"
                  value={formData.module.specialization}
                  readOnly
                  className="w-full px-4 py-2.5 text-black bg-gray-100 border border-gray-300 rounded-lg"
                />
                {getErrorDisplay('module', 'specialization')}
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-black pt-2">Semester:</label>
              <div>
                <select 
                  value={formData.module.semester}
                  onChange={(e) => handleModuleChange('semester', e.target.value)}
                  className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    touched.module?.semester && errors.module?.semester ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
                {getErrorDisplay('module', 'semester')}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Session Info Section - Full Width */}
      <section className="space-y-6 pt-4">
        <div className="flex justify-between items-center pb-3 border-b">
          <h2 className="text-xl font-semibold text-black">Session Information</h2>
          <button
            type="button"
            onClick={addSlot}
            className="bg-white text-blue-300 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Add Slot
          </button>
        </div>

        <div className="space-y-8">
          {formData.sessions.map((session, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-black">Slot {index + 1}</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Session Name:</label>
                  <div>
                    <input
                      type="text"
                      required
                      disabled={index > 0}
                      value={session.name}
                      onChange={(e) => handleSessionChange(index, 'name', e.target.value)}
                      placeholder="Enter session name"
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        index > 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${
                        touched.sessions?.[index]?.name && errors.sessions?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {touched.sessions?.[index]?.name && errors.sessions?.[index]?.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Type:</label>
                  <div>
                    <select
                      required
                      disabled={index > 0}
                      value={session.type}
                      onChange={(e) => handleSessionChange(index, 'type', e.target.value)}
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        index > 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${
                        touched.sessions?.[index]?.type && errors.sessions?.[index]?.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select type</option>
                      <option value="viva">Viva</option>
                      <option value="presentation">Presentation</option>
                      <option value="test">Test</option>
                    </select>
                    {touched.sessions?.[index]?.type && errors.sessions?.[index]?.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].type}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Start Time:</label>
                  <div>
                    <input
                      type="time"
                      required
                      value={session.startTime}
                      onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)}
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        touched.sessions?.[index]?.startTime && errors.sessions?.[index]?.startTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {touched.sessions?.[index]?.startTime && errors.sessions?.[index]?.startTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].startTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">End Time:</label>
                  <div>
                    <input
                      type="time"
                      required
                      value={session.endTime}
                      onChange={(e) => handleSessionChange(index, 'endTime', e.target.value)}
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        touched.sessions?.[index]?.endTime && errors.sessions?.[index]?.endTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {touched.sessions?.[index]?.endTime && errors.sessions?.[index]?.endTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].endTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Location:</label>
                  <div>
                    <input
                      type="text"
                      required
                      value={session.location}
                      onChange={(e) => handleSessionChange(index, 'location', e.target.value)}
                      placeholder="Enter location"
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        touched.sessions?.[index]?.location && errors.sessions?.[index]?.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {touched.sessions?.[index]?.location && errors.sessions?.[index]?.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].location}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Delivery Method:</label>
                  <div>
                    <select
                      required
                      disabled={index > 0}
                      value={session.deliveryMethod}
                      onChange={(e) => handleSessionChange(index, 'deliveryMethod', e.target.value)}
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        index > 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${
                        touched.sessions?.[index]?.deliveryMethod && errors.sessions?.[index]?.deliveryMethod ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select method</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {touched.sessions?.[index]?.deliveryMethod && errors.sessions?.[index]?.deliveryMethod && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].deliveryMethod}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-black pt-2">Date:</label>
                  <div>
                    <input
                      type="date"
                      required
                      value={session.date}
                      onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                      className={`w-full px-4 py-2.5 text-black bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                        touched.sessions?.[index]?.date && errors.sessions?.[index]?.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {touched.sessions?.[index]?.date && errors.sessions?.[index]?.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessions[index].date}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white text-red-300 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          {editMode ? 'Update Slot' : 'Create Slots'}
        </button>
      </div>
    </form>
  );
};

export default SlotForm; 