import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const modalRef = useRef(null);
    
    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    // Handle click outside modal content to close
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);
    
    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    
    // Size classes
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
    };
    
    if (!isOpen) return null;
    
    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
            
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* Modal content */}
                <div 
                    ref={modalRef}
                    className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${sizeClasses[size] || sizeClasses.md}`}
                >
                    {/* Modal header */}
                    <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Modal body */}
                    <div className="px-6 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
