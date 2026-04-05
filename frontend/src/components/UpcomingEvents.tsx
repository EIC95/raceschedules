"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { fetchUpcomingEvents } from '../api/events';
import type { Event } from '../api/events';

function formatDateRange(event: Event): string {
    const start = dayjs(event.start_date);
    const end = dayjs(event.end_date);
    if (start.month() === end.month()) {
        return start.date() !== end.date()
            ? `${start.format('MMM D')}–${end.format('D')}`.toUpperCase()
            : start.format('MMM D').toUpperCase();
    }
    return `${start.format('MMM D')}–${end.format('MMM D')}`.toUpperCase();
}

const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUpcomingEvents()
            .then(setEvents)
            .catch(() => setError('Failed to load upcoming events.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-4 h-4 opacity-60" />
                <span>{error}</span>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-extrabold text-black dark:text-white uppercase mb-4">Upcoming</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events.</p>
            </div>
        );
    }

    return (
        <section>
            <h2 className="text-2xl font-extrabold text-black dark:text-white uppercase mb-4">Upcoming</h2>
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                {events.map(event => (
                    <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="flex items-center gap-4 py-3 px-1 rounded-sm hover:bg-gray-50 dark:hover:bg-neutral-900 group transition-colors"
                    >
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums shrink-0 w-20">
                            {formatDateRange(event)}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black dark:text-white uppercase truncate">
                                {event.name}
                            </p>
                            {event.championship && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase truncate mt-0.5">
                                    {event.championship.name}
                                </p>
                            )}
                        </div>
                        <ChevronRight
                            size={14}
                            className="text-gray-300 dark:text-neutral-600 shrink-0 group-hover:text-black dark:group-hover:text-white transition-colors"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default UpcomingEvents;
