"use client";
import { useState, useEffect } from 'react';
import SessionTimeDisplay from './SessionTimeDisplay';
import CountdownTimer from './CountdownTimer';
import { fetchNextSession } from '../api/sessions';
import type { Session } from '../api/sessions';
import { AlertCircle, Loader2 } from 'lucide-react';

interface NextSessionProps {
    initialData?: Session | null;
}

const NextSession: React.FC<NextSessionProps> = ({ initialData }) => {
    const [nextSession, setNextSession] = useState<Session | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData && initialData !== null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData === undefined) {
            fetchNextSession()
                .then(setNextSession)
                .catch(() => setError('Failed to load next session.'))
                .finally(() => setLoading(false));
        }
    }, [initialData]);

    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 py-10 text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-4 h-4 opacity-60" />
                <span>{error}</span>
            </div>
        );
    }

    if (!nextSession) {
        return <p className="text-sm text-gray-500 dark:text-gray-400 py-10">No upcoming sessions found.</p>;
    }

    return (
        <div className="border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 hover:border-black dark:hover:border-white transition-colors duration-200">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Next Session</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-wrap">
                <div className="flex-1 min-w-0">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white uppercase leading-none mb-2">
                        {nextSession.event.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
                        {nextSession.event.championship.name} — {nextSession.name}
                    </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <SessionTimeDisplay startTime={nextSession.start_time} sessionTimezone={nextSession.timezone} />
                    <CountdownTimer startTime={nextSession.start_time} />
                </div>
            </div>
        </div>
    );
};

export default NextSession;
