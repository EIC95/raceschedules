import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import EventCard from '../../../components/EventCard';
import { fetchChampionshipDetails, fetchChampionships } from '../../../api/championships';
import type { Event } from '../../../api/events';
import type { Metadata } from 'next';
import dayjs from 'dayjs';

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
                canonical: `https://raceschedules.app/championships/${championship.slug}`
            },
            openGraph: {
                images: "https://raceschedules.app/og-image.png"
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

    if (error || !championship) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <p className="text-gray-500 dark:text-gray-400 text-sm py-8">
                    {error ?? 'Championship not found.'}
                </p>
            </main>
        );
    }

    const sortedEvents = championship.events
        ? [...championship.events].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        : [];

    const now = dayjs();
    // First event whose end_date hasn't passed yet
    const nextEventIdx = sortedEvents.findIndex(e => !dayjs(e.end_date).isBefore(now));

    return (
        <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
            {/* Back link */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-xs font-bold uppercase text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                    <ChevronLeft size={14} className="mr-0.5" /> Home
                </Link>
            </div>

            {/* Championship header */}
            <div className="mb-10">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    {championship.category.name}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white uppercase leading-none mt-2">
                    {championship.name}
                </h2>
            </div>

            {/* Events */}
            <section>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                    {sortedEvents.length} Event{sortedEvents.length !== 1 ? 's' : ''}
                </h3>
                {sortedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sortedEvents.map((event, idx) => {
                            const isPast = dayjs(event.end_date).isBefore(now);
                            return (
                                <EventCard
                                    key={event.id}
                                    event={event as Event}
                                    isPast={isPast}
                                    isNext={idx === nextEventIdx}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No events for this championship.</p>
                )}
            </section>
        </main>
    );
}
