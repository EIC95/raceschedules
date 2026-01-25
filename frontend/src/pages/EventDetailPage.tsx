import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SessionCard from '../components/SessionCard'; 
import { fetchEventDetails } from '../api/events';
import type { EventDetail } from '../api/events';
import dayjs from 'dayjs'; 
import Footer from '../components/Footer';
import SeoHead from "../components/SeoHead";
import Header from "../components/Header";

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

    let pageTitle = "Loading Event...";
    let pageDescription = "Loading event details.";

    if (error) {
        pageTitle = "Error";
        pageDescription = `Error loading event: ${error}`;
    } else if (!loading && !event) {
        pageTitle = "Event Not Found";
        pageDescription = "The requested event could not be found.";
    } else if (event) {
        pageTitle = `${event.name}`;
        pageDescription = `Details for ${event.name}${event.championship?.name ? ` from the ${event.championship.name}` : ''}. View all sessions and schedules.`;
    }

    useEffect(() => {
        document.title = `${pageTitle} | Race Schedules`;
    }, [pageTitle]);

    const startDate = event ? dayjs(event.start_date) : null;
    const endDate = event ? dayjs(event.end_date) : null;

    let dateRange = '';
    if (startDate && endDate) {
        dateRange = startDate.format('MMM DD').toUpperCase();
        if (startDate.month() === endDate.month()) {
            if (startDate.date() !== endDate.date()) {
                dateRange = `${startDate.format('MMM DD')} - ${endDate.format('DD')}, ${startDate.year()}`.toUpperCase();
            } else { 
                dateRange = `${startDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
            }
        } else {
            dateRange = `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
        }
    }
    
    return (
        <>
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalUrl={event ? `/events/${event.slug}` : undefined}
                ogTitle={pageTitle}
                ogDescription={pageDescription}
            />
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />

                {loading ? (
                    <div className="text-center py-8">Loading event details...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">Error: {error}</div>
                ) : !event ? (
                    <div className="text-center py-8">Event not found.</div>
                ) : (
                    <>
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
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black uppercase leading-none mt-4">
                                {event.name}
                            </h2>
                            <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase mt-4 inline-block">
                                {dateRange}
                            </span>
                        </div>

                        <section className="my-8">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-black uppercase mb-6">Sessions</h3>
                            <div className="border-t-2 border-black pt-4"> {/* Separator line */}
                                {event.sessions.length > 0 ? (
                                    event.sessions.map(session => (
                                        <SessionCard key={session.id} session={session} />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-600">No sessions found for this event.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
};

export default EventDetailPage;
