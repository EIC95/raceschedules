import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TimezoneToggle from '../components/TimezoneToggle';
import EventCard from '../components/EventCard';
import { fetchChampionshipDetails } from '../api/championships';
import type { ChampionshipDetail } from '../api/championships';
import type { Event } from '../api/events';
import Footer from '../components/Footer';

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

    if (loading) {
        return <div className="text-center py-8">Loading championship details...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!championship) {
        return <div className="text-center py-8">Championship not found.</div>;
    }

    return (
        <>
            <main className="px-36 py-10">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1>
                    <TimezoneToggle />
                </header>

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
                        {championship.events.length > 0 ? (
                            championship.events.map(event => (
                                <EventCard key={event.id} event={event as Event} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-600">No upcoming events for this championship.</p>
                        )}
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
};

export default ChampionshipDetailPage;
