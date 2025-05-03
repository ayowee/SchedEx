// src/components/common/Header/index.jsx
import { 
    MagnifyingGlassIcon, 
    BellIcon
} from '@heroicons/react/24/outline';
import Logo from '../../../assets/Logo.png';
import { useState, useEffect } from 'react';

export const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    return (
        <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between fixed top-0 right-0 left-0 z-10 ml-64 transition-all duration-300 ease-in-out">
            {/* Logo */}
            <div className="flex items-center mr-6">
                <img src={Logo} alt="SchedEx Logo" className="h-8" />
            </div>
            
            {/* Left side - Search */}
            <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search or type command..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">⌘K</span>
                </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                {/* User profile */}
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user?.fullName ? user.fullName[0].toUpperCase() : '?'}
                    </div>
                    <div className="ml-2 hidden md:block">
                        <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Loading...'}</p>
                        <p className="text-xs text-gray-500">{user?.userType || 'Loading...'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
