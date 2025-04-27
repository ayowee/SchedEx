import { statusOptions } from '../../data/presentationConfig';

export const StatusBadge = ({ status, className = '' }) => {
    const config = statusOptions.find(opt => opt.value === status) || {};

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color} ${className}`}
        >
            <span className="w-2 h-2 rounded-full bg-white bg-opacity-80 mr-2" />
            {config.label}
        </motion.span>
    );
};