// src/components/admin/Footer/index.jsx
import { HeartIcon } from '@heroicons/react/24/outline';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-white border-t border-gray-100 py-4 px-6 text-center text-gray-600 text-sm">
            <div className="flex items-center justify-center">
                <p> {currentYear} SchedEx. All rights reserved.</p>
                <span className="mx-2">|</span>
                <p className="flex items-center">
                    Made with <HeartIcon className="h-4 w-4 text-red-500 mx-1" /> by Team SchedEx
                </p>
            </div>
            <div className="mt-1 text-xs text-gray-500">
                Version 1.0.0
            </div>
        </footer>
    );
};

export default Footer;
