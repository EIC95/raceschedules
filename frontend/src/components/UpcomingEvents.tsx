"use client";
import { useState, useEffect } from 'react';
import { fetchUpcomingEvents } from '../api/events';
import type { Event } from '../api/events';
import EventCard from './EventCard';
import { AlertCircle, Loader2 } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUpcomingEvents = async () => {
            try {
                setLoading(true);
                const data = await fetchUpcomingEvents();
                setEvents(data);
            } catch (err) {
                console.error('Failed to load upcoming events:', err);
                setError('Failed to load upcoming events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getUpcomingEvents();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-8"><Loader2 className='w-10 h-10 animate-spin'/></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center py-10">
                <h2 className="text-2xl font-extrabold text-black uppercase mb-6 text-left w-full">
                    Upcoming Events
                </h2>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <AlertCircle className="w-4 h-4 opacity-60" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return <>
            <h2 className="text-2xl font-extrabold text-black uppercase mb-6">Upcoming Events</h2>
            <div className="text-center text-gray-500 text-sm py-8">No upcoming events found.</div>
        </>;
    }

    return (
        <section className="my-8">
            <h2 className="text-2xl font-extrabold text-black uppercase mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
};

export default UpcomingEvents;
