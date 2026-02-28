import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import EventCard from '../../../components/EventCard';
import { fetchChampionshipDetails, fetchChampionships } from '../../../api/championships';
import type { Event } from '../../../api/events';
import Footer from '../../../components/Footer';
import Header from "../../../components/Header";
import type { Metadata } from 'next';

interface Params {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    try {
        const championships = await fetchChampionships();
        return championships.map((c) => ({ slug: c.slug }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    try {
        const championship = await fetchChampionshipDetails(slug);
        return {
            title: `${championship.name} | RaceSchedules`,
            description: `Full ${championship.name} season schedule — every race, every date, all in one place.`,
            alternates: {
                canonical: `https://raceschedules.ibrahima.dev/championships/${championship.slug}`
            },
            openGraph: {
                images: "https://raceschedules.ibrahima.dev/og-image.png"
            }
        };
    } catch (e) {
        return { title: 'Championship Not Found' };
    }
}

export default async function ChampionshipDetailPage({ params }: Params) {
    const { slug } = await params;

    let championship;
    let error;

    try {
        championship = await fetchChampionshipDetails(slug);
    } catch (err) {
        error = 'Failed to load championship details.';
    }

    if (error) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="text-center py-8 text-red-500">Error: {error}</div>
                <Footer />
            </main>
        );
    }

    if (!championship) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="text-center py-8">Championship not found.</div>
                <Footer />
            </main>
        );
    }

    const sortedEvents = championship.events ? [...championship.events].sort((a, b) => {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }) : [];

    return (
        <>
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="mb-10">
                    <Link href="/" className="flex items-center text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors duration-200">
                        <ChevronLeft size={16} className="mr-1" /> BACK TO HOME
                    </Link>
                </div>

                <div className="mb-8">
                    <span className="text-gray-500 text-xs font-bold px-2 py-1 uppercase border border-gray-500">
                        {championship.category.name}
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black uppercase leading-none mt-4">
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
            </main>
            <Footer />
        </>
    );
}
