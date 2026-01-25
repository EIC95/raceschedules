import { Clock, MapPin } from 'lucide-react';
import { useTimezone } from '../context/TimezoneContext';

export default function TimezoneToggle(){
    const { selectedTimezone, setSelectedTimezone } = useTimezone();

    const toggleTimezone = (timezone: 'your_time' | 'track_time') => {
        setSelectedTimezone(timezone);
    };

    return (
        <div className="relative flex items-center p-1 border-2 border-black">
            {/* Sliding background for the active state */}
            <div
                className={`absolute top-1 left-1 h-[calc(100%-8px)] bg-black transition-all duration-300 ease-in-out text-xs font-bold`}
                style={{
                    width: 'calc(50% - 4px)',
                    transform: selectedTimezone === 'your_time' ? 'translateX(0)' : 'translateX(calc(100%))',
                }}
            ></div>

            <button
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-1.5 transition-colors duration-300 ease-in-out text-xs font-bold
                        ${selectedTimezone === 'your_time' ? 'text-white' : 'text-gray-600 cursor-pointer'}`}
                onClick={() => toggleTimezone('your_time')}
            >
                <Clock size={15} />
                Your Time
            </button>

            <button
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-1.5 transition-colors duration-300 ease-in-out text-xs font-bold
                        ${selectedTimezone === 'track_time' ? 'text-white' : 'text-gray-600 cursor-pointer'}`}
                onClick={() => toggleTimezone('track_time')}
            >
                <MapPin size={15} />
                Track Time
            </button>
        </div>
    );
}