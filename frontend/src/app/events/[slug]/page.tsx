import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SessionCard from '../../../components/SessionCard';
import { fetchEventDetails, fetchUpcomingEvents } from '../../../api/events';
import dayjs from 'dayjs';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Params {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    try {
        const events = await fetchUpcomingEvents();
        return events.map((e) => ({ slug: e.slug }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    try {
        const event = await fetchEventDetails(slug);
        const startDate = dayjs(event.start_date);
        const endDate = dayjs(event.end_date);
        return {
            title: `${event.name} | RaceSchedules`,
            description: startDate.isSame(endDate, 'day')
                ? `Full schedule for ${event.name} on ${startDate.format('MMM DD')} — don't miss a single lap.`
                : `Follow every session of ${event.name}. Full schedule from ${startDate.format('MMM DD')} to ${endDate.format('MMM DD')} — don't miss a single lap.`,
            alternates: {
                canonical: `https://raceschedules.app/events/${event.slug}`
            },
            openGraph: {
                images: "https://raceschedules.app/og-image.png"
            }
        };
    } catch (e) {
        return { title: 'Event Not Found' };
    }
}

export default async function EventDetailPage({ params }: Params) {
    const { slug } = await params;

    let event;
    let error;

    try {
        event = await fetchEventDetails(slug);
    } catch (err) {
        error = 'Failed to load event details.';
    }

    if (error || !event) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <p className="text-gray-500 dark:text-gray-400 text-sm py-8">
                    {error ?? 'Event not found.'}
                </p>
                <Footer />
            </main>
        );
    }

    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    let dateRange = '';
    if (startDate.isValid() && endDate.isValid()) {
        if (startDate.month() === endDate.month()) {
            dateRange = startDate.date() !== endDate.date()
                ? `${startDate.format('MMM DD')} – ${endDate.format('DD')}, ${startDate.year()}`.toUpperCase()
                : `${startDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
        } else {
            dateRange = `${startDate.format('MMM DD')} – ${endDate.format('MMM DD')}, ${startDate.year()}`.toUpperCase();
        }
    }

    // Sort sessions by start_time, then session_number as tiebreaker
    const sortedSessions = [...event.sessions].sort((a, b) => {
        const timeDiff = new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        return timeDiff !== 0 ? timeDiff : a.session_number - b.session_number;
    });

    return (
        <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
            {/* Back link */}
            <div className="mb-8">
                <Link
                    href={`/championships/${event.championship?.slug}`}
                    className="inline-flex items-center text-xs font-bold uppercase text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                    <ChevronLeft size={14} className="mr-0.5" />
                    {event.championship?.name ?? 'Back'}
                </Link>
            </div>

            {/* Event header */}
            <div className="mb-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold px-2 py-1 bg-black dark:bg-white text-white dark:text-black uppercase">
                        {dateRange}
                    </span>
                    {event.cancelled && (
                        <span className="text-xs font-bold px-2 py-1 border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-gray-400 uppercase">
                            Cancelled
                        </span>
                    )}
                    {event.postponed && !event.cancelled && (
                        <span className="text-xs font-bold px-2 py-1 border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-gray-400 uppercase">
                            Postponed
                        </span>
                    )}
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white uppercase leading-none">
                    {event.name}
                </h2>
                {event.championship?.name && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mt-2">
                        {event.championship.name}
                    </p>
                )}
            </div>

            {/* Sessions */}
            <section>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                    Sessions
                </h3>
                {sortedSessions.length > 0 ? (
                    <div>
                        {sortedSessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                postponed={event.postponed}
                                cancelled={event.cancelled}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No sessions found for this event.</p>
                )}
            </section>
        </main>
    );
}
