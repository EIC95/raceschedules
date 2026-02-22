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

        if (selectedTimezone === 'your_time') {
            displayTime = utcDate.local().format('HH[h]mm');
        } else {
            displayTime = utcDate.tz(sessionTimezone).format('HH[h]mm');
        }
    }

    return (
        <div className="flex items-center gap-1 text-sm font-bold uppercase">
            <Clock size={15} className="text-gray-600" />
            STARTS {displayTime}
        </div>
    );
};

export default SessionTimeDisplay;