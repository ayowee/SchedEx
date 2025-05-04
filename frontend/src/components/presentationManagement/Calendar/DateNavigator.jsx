import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { isValid, parse } from 'date-fns';

export default function DateNavigator({ onDateChange }) {
    const [searchDate, setSearchDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchDate) {
            setError('Please enter a date');
            return;
        }

        const dateObj = parse(searchDate, 'yyyy-MM-dd', new Date());
        if (!isValid(dateObj)) {
            setError('Invalid date format');
            return;
        }

        setError('');
        onDateChange({ start: dateObj, end: dateObj });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => {
                        setSearchDate(e.target.value);
                        setError('');
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Search date..."
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
                Search
            </button>
            {error && (
                <p className="text-sm text-red-600 absolute mt-1">
                    {error}
                </p>
            )}
        </form>
    );
}
