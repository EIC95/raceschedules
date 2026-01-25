import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TimezoneToggle from '../components/TimezoneToggle';
import EventCard from '../components/EventCard';
import { fetchChampionshipDetails } from '../api/championships';
import type { ChampionshipDetail } from '../api/championships';
import type { Event } from '../api/events';
import Footer from '../components/Footer';
import SeoHead from "../components/SeoHead";

const ChampionshipDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [championship, setChampionship] = useState<ChampionshipDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError('Championship slug is missing.');
            setLoading(false);
            return;
        }

        const getChampionshipDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchChampionshipDetails(slug);
                setChampionship(data);
            } catch (err) {
                console.error(`Error fetching championship ${slug} details:`, err);
                setError('Failed to load championship details.');
            } finally {
                setLoading(false);
            }
        };

        getChampionshipDetails();
    }, [slug]);

    let pageTitle = "Loading Championship...";
    let pageDescription = "Loading championship details.";

    if (error) {
        pageTitle = "Error";
        pageDescription = `Error loading championship: ${error}`;
    } else if (!loading && !championship) {
        pageTitle = "Championship Not Found";
        pageDescription = "The requested championship could not be found.";
    } else if (championship) {
        pageTitle = `${championship.name}`;
        pageDescription = `Details for ${championship.name}, part of the ${championship.category.name} category. Discover all upcoming events.`;
    }

    useEffect(() => {
        document.title = `${pageTitle} | Race Schedules`;
    }, [pageTitle]);

    const sortedEvents = championship?.events ? [...championship.events].sort((a, b) => {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }) : [];

    return (
        <>
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalUrl={championship ? `/championships/${championship.slug}` : undefined}
                ogTitle={pageTitle}
                ogDescription={pageDescription}
            />
            <main className="px-36 py-10">
                <header className="flex justify-between items-center mb-10">
                    <Link to="/"><h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1></Link>
                    <TimezoneToggle />
                </header>

                {loading ? (
                    <div className="text-center py-8">Loading championship details...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">Error: {error}</div>
                ) : !championship ? (
                    <div className="text-center py-8">Championship not found.</div>
                ) : (
                    <>
                        <div className="mb-10">
                            <Link to="/" className="flex items-center text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors duration-200">
                                <ChevronLeft size={16} className="mr-1" /> BACK TO HOME
                            </Link>
                        </div>

                        <div className="mb-8">
                            <span className="text-gray-500 text-xs font-bold px-2 py-1 uppercase border border-gray-500">
                                {championship.category.name}
                            </span>
                            <h2 className="text-6xl font-extrabold text-black uppercase leading-none mt-4">
                                {championship.name}
                            </h2>
                        </div>

                        <section className="my-8">
                            <h3 className="text-2xl font-extrabold text-black uppercase mb-6">Events</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedEvents.length > 0 ? (
                                    sortedEvents.map(event => (
                                        <EventCard key={event.id} event={event as Event} />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-600">No upcoming events for this championship.</p>
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

export default ChampionshipDetailPage;