"use client";
import { Clock, MapPin } from 'lucide-react';
import { useTimezone } from '../context/TimezoneContext';

export default function TimezoneToggle() {
    const { selectedTimezone, setSelectedTimezone } = useTimezone();

    return (
        <div className="relative flex items-center p-0.5 border border-gray-300 dark:border-neutral-700">
            {/* Sliding background */}
            <div
                className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] bg-black dark:bg-white transition-all duration-300 ease-in-out"
                style={{
                    width: 'calc(50% - 2px)',
                    transform: selectedTimezone === 'your_time' ? 'translateX(0)' : 'translateX(calc(100%))',
                }}
            />

            <button
                className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 transition-colors duration-300 ease-in-out text-xs font-bold cursor-pointer
                    ${selectedTimezone === 'your_time' ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setSelectedTimezone('your_time')}
            >
                <Clock size={13} />
                Your Time
            </button>

            <button
                className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 transition-colors duration-300 ease-in-out text-xs font-bold cursor-pointer
                    ${selectedTimezone === 'track_time' ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setSelectedTimezone('track_time')}
            >
                <MapPin size={13} />
                Track Time
            </button>
        </div>
    );
}
