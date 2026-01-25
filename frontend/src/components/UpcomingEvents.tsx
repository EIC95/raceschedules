import React, { useState, useEffect } from 'react';
import { fetchUpcomingEvents } from '../api/events';
import type { Event } from '../api/events';
import EventCard from './EventCard';

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
        return <div className="text-center py-8">Loading upcoming events...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (events.length === 0) {
        return <div className="text-center py-8">No upcoming events found.</div>;
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
