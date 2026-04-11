import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { Session } from '../api/sessions';
import SessionTimeDisplay from './SessionTimeDisplay';

dayjs.extend(utc);

interface SessionCardProps {
    session: Session;
    postponed?: boolean;
    cancelled?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, postponed, cancelled }) => {
    const sessionDate = dayjs.utc(session.start_time).local();
    const dayLabel = sessionDate.format('ddd D MMM').toUpperCase();

    return (
        <div className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-neutral-800">

            {/* Session number */}
            <span className="text-2xl font-extrabold text-gray-400 dark:text-neutral-600 tabular-nums w-7 shrink-0 text-right select-none">
                {session.session_number}
            </span>

            {/* Session info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-black dark:text-white uppercase leading-tight">
                        {session.name}
                    </h4>
                    {cancelled && (
                        <span className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase">Cancelled</span>
                    )}
                    {postponed && !cancelled && (
                        <span className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase">Postponed</span>
                    )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase mt-0.5">{dayLabel}</p>
            </div>

            {/* Time */}
            <SessionTimeDisplay startTime={session.start_time} sessionTimezone={session.timezone} />
        </div>
    );
};

export default SessionCard;
