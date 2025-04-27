// components/ui/model/index.jsx
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createFocusTrap } from "focus-trap";

export const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    subtitle,
    size = "md",
    persistent = false
}) => {
    const modalRef = useRef(null);
    const trap = useRef(null);

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-4xl",
        full: "max-w-full"
    };

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && !persistent) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            trap.current = createFocusTrap(modalRef.current, {
                escapeDeactivates: () => {
                    if (!persistent) onClose();
                    return false;
                }
            });
            trap.current.activate();
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            trap.current?.deactivate();
        };
    }, [isOpen, persistent, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        ref={modalRef}
                        className={`${sizeClasses[size]} w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h3>
                                    {subtitle && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                {!persistent && (
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        aria-label="Close"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">{children}</div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};