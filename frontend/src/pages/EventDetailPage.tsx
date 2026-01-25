import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TimezoneToggle from '../components/TimezoneToggle';
import SessionCard from '../components/SessionCard'; 
import { fetchEventDetails } from '../api/events';
import type { EventDetail } from '../api/events';
import dayjs from 'dayjs'; 
import Footer from '../components/Footer';

const EventDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError('Event slug is missing.');
            setLoading(false);
            return;
        }

        const getEventDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchEventDetails(slug);
                setEvent(data);
            } catch (err) {
                console.error(`Error fetching event ${slug} details:`, err);
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        getEventDetails();
    }, [slug]);

    if (loading) {
        return <div className="text-center py-8">Loading event details...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!event) {
        return <div className="text-center py-8">Event not found.</div>;
    }

    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    let dateRange = startDate.format('MMM DD').toUpperCase();
    if (startDate.month() === endDate.month()) {
        if (startDate.date() !== endDate.date()) {
            dateRange = `${startDate.format('MMM DD')} - ${endDate.format('DD')}, ${startDate.year()}`.toUpperCase();
        } else { 
            dateRange = `${startDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
        }
    } else {
        dateRange = `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
    }


    return (
        <>
            <main className="px-36 py-10">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1>
                    <TimezoneToggle />
                </header>

                <div className="mb-10">
                    {event.championship?.slug ? (
                        <Link to={`/championships/${event.championship.slug}`} className="flex items-center text-gray-500 text-xs font-bold uppercase hover:text-black transition-colors duration-200">
                            <ChevronLeft size={16} className="mr-1" /> BACK TO CHAMPIONSHIP
                        </Link>
                    ) : (
                        <Link to="/" className="flex items-center text-gray-500 text-xs font-bold uppercase hover:text-black transition-colors duration-200">
                            <ChevronLeft size={16} className="mr-1" /> BACK TO HOME
                        </Link>
                    )}
                </div>

                <div className="mb-8">
                    {event.championship?.name && ( 
                        <span className="text-gray-500 border border-gray-500 text-xs font-bold px-2 py-1 uppercase mb-2 inline-block">
                            {event.championship.name}
                        </span>
                    )}
                    <h2 className="text-6xl font-extrabold text-black uppercase leading-none mt-4">
                        {event.name}
                    </h2>
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase mt-4 inline-block">
                        {dateRange}
                    </span>
                </div>

                <section className="my-8">
                    <h3 className="text-2xl font-extrabold text-black uppercase mb-6">Sessions</h3>
                    <div>
                        {event.sessions.length > 0 ? (
                            event.sessions.map(session => (
                                <SessionCard key={session.id} session={session} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-600">No sessions found for this event.</p>
                        )}
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
};

export default EventDetailPage;
