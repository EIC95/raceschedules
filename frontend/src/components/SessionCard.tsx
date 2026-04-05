"use client";
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { Session } from '../api/sessions';
import SessionTimeDisplay from './SessionTimeDisplay';

dayjs.extend(utc);

function getStatus(startTime: string): 'live' | 'upcoming' | 'past' {
    const now = dayjs();
    const start = dayjs.utc(startTime).local();
    if (now.isAfter(start.add(3, 'hour'))) return 'past';
    if (now.isAfter(start.subtract(5, 'minute'))) return 'live';
    return 'upcoming';
}

interface SessionCardProps {
    session: Session;
    postponed?: boolean;
    cancelled?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, postponed, cancelled }) => {
    const [status, setStatus] = useState<'live' | 'upcoming' | 'past'>(() => getStatus(session.start_time));

    useEffect(() => {
        const update = () => setStatus(getStatus(session.start_time));
        update();
        const interval = setInterval(update, 30_000);
        return () => clearInterval(interval);
    }, [session.start_time]);

    const sessionDate = dayjs.utc(session.start_time).local();
    const dayLabel = sessionDate.format('ddd D MMM').toUpperCase();
    const isCompleted = status === 'past' && !(postponed || cancelled);
    const isLive = status === 'live' && !(postponed || cancelled);

    return (
        <div className={`flex items-center gap-3 py-4 border-b border-gray-100 dark:border-neutral-800 transition-opacity
            ${isCompleted ? 'opacity-40' : ''}
            ${isLive ? 'border-l-2 border-l-green-500 pl-3 -ml-3' : ''}`}>

            {/* Status dot */}
            <div className="w-4 shrink-0 flex justify-center">
                {isLive ? (
                    <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ) : status === 'upcoming' ? (
                    <span className="block w-2 h-2 rounded-full border border-gray-300 dark:border-neutral-600" />
                ) : (
                    <span className="block w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700" />
                )}
            </div>

            {/* Session number */}
            <span className="text-2xl font-extrabold text-gray-200 dark:text-neutral-800 tabular-nums w-7 shrink-0 text-right select-none">
                {session.session_number}
            </span>

            {/* Session info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-black dark:text-white uppercase leading-tight">
                        {session.name}
                    </h4>
                    {isLive && (
                        <span className="text-xs font-bold text-green-500 uppercase">Live</span>
                    )}
                    {isCompleted && (
                        <span className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase">Done</span>
                    )}
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
