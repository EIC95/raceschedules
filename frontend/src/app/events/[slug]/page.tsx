import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SessionCard from '../../../components/SessionCard';
import { fetchEventDetails, fetchUpcomingEvents } from '../../../api/events';
import dayjs from 'dayjs';
import Footer from '../../../components/Footer';
import Header from "../../../components/Header";
import type { Metadata } from 'next';

interface Params {
    params: Promise<{ slug: string }>;
}

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
                canonical: `https://raceschedules.ibrahima.dev/events/${event.slug}`
            },
            openGraph: {
                images: "https://raceschedules.ibrahima.dev/og-image.png"
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

    if (error) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="text-center py-8 text-red-500">Error: {error}</div>
                <Footer />
            </main>
        );
    }

    if (!event) {
        return (
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="text-center py-8">Event not found.</div>
                <Footer />
            </main>
        );
    }

    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    let dateRange = '';
    if (startDate.isValid() && endDate.isValid()) {
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
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
                <div className="flex gap-4 flex-col mb-10">
                    <Link href={`/championships/${event.championship!.slug}`} className="flex items-center text-gray-500 text-xs font-bold uppercase hover:text-black transition-colors duration-200">
                        <ChevronLeft size={16} className="mr-1" /> BACK TO CHAMPIONSHIP
                    </Link>
                    <Link href="/" className="flex items-center text-gray-500 text-xs font-bold uppercase hover:text-black transition-colors duration-200">
                        <ChevronLeft size={16} className="mr-1" /> BACK TO HOME
                    </Link>
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
            </main>
            <Footer />
        </>
    );
}
