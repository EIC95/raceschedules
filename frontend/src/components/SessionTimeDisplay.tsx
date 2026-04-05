"use client";
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTimezone } from '../context/TimezoneContext';

dayjs.extend(utc);
dayjs.extend(timezone);

interface SessionTimeDisplayProps {
    startTime: string;
    sessionTimezone: string;
}

const SessionTimeDisplay: React.FC<SessionTimeDisplayProps> = ({ startTime, sessionTimezone }) => {
    const { selectedTimezone } = useTimezone();
    let displayTime = '';

    if (startTime) {
        const utcDate = dayjs.utc(startTime);
        displayTime = selectedTimezone === 'your_time'
            ? utcDate.local().format('HH[h]mm')
            : utcDate.tz(sessionTimezone).format('HH[h]mm');
    }

    return (
        <div className="flex items-center gap-1 text-sm font-bold uppercase shrink-0">
            <Clock size={13} className="text-gray-400 dark:text-gray-500" />
            <span className="text-gray-500 dark:text-gray-400 text-xs">Starts</span>
            <span className="text-black dark:text-white">{displayTime}</span>
        </div>
    );
};

export default SessionTimeDisplay;
