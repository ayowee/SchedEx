// src/components/admin/Sidebar/index.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    HomeIcon, 
    CalendarIcon, 
    UserGroupIcon,
    ClockIcon,
    AcademicCapIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    UserPlusIcon,
    ArrowRightOnRectangleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Modal from '../../ui/modal';

export const Sidebar = ({ onToggle }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        const newCollapsedState = !collapsed;
        setCollapsed(newCollapsedState);
        // Notify parent component about the sidebar state change
        if (onToggle) {
            onToggle(newCollapsedState);
        }
    };

    // Notify parent component on mount
    useEffect(() => {
        if (onToggle) {
            onToggle(collapsed);
        }
    }, [collapsed, onToggle]);

    return (
        <aside className={`${collapsed ? 'w-16' : 'w-52'} bg-white shadow-md fixed top-0 left-0 h-screen border-r border-gray-100 z-10 transition-all duration-300 ease-in-out`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                {!collapsed && (
                    <h5 className="text-xl font-bold text-black">Admin Portal</h5>
                )}
                <button 
                    onClick={toggleSidebar} 
                    className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${collapsed ? 'mx-auto' : ''}`}
                >
                    {collapsed ? 
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" /> : 
                        <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
                    }
                </button>
            </div>
            
            <div className="p-4">
                {!collapsed && (
                    <p className="text-xs font-medium uppercase text-gray-500 mb-4">MENU</p>
                )}
                
                <nav className="space-y-1">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <HomeIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Dashboard"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Dashboard
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/presentations"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <DocumentTextIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Presentations"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Presentations
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/scheduler"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <CalendarIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Admin Scheduler"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Admin Scheduler
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/availability"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <ClockIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Examiner Availability"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Examiner Availability
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/examiners"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <AcademicCapIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Examiners"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Examiners
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/students"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <UserGroupIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Students"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Students
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/users"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <UserPlusIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Manage Users"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Manage Users
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/time-slots"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <ClockIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Time Slots"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Time Slots
                            </span>
                        )}
                    </NavLink>
                    
                    <NavLink
                        to="/admin/settings"
                        end
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg transition-colors group relative ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <Cog6ToothIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Settings"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Settings
                            </span>
                        )}
                    </NavLink>
                    
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`flex items-center p-2 rounded-lg transition-colors bg-red-600 text-white hover:bg-red-700 mt-4 group relative w-full ${collapsed ? 'justify-center' : ''}`}
                    >
                        <ArrowRightOnRectangleIcon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
                        {!collapsed && "Logout"}
                        {collapsed && (
                            <span className="absolute left-full ml-2 w-auto p-2 min-w-max rounded-md shadow-md text-gray-800 bg-white text-xs font-medium transition-all duration-100 origin-left scale-0 group-hover:scale-100 z-20">
                                Logout
                            </span>
                        )}
                    </button>

                    {/* Logout Confirmation Modal */}
                    <Modal
                        isOpen={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        title="Confirm Logout"
                        size="sm"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                            </div>
                            <p className="text-center text-gray-700 mb-6">
                                Are you sure you want to logout?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/');
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Modal>
                </nav>
            </div>
        </aside>
    );
};