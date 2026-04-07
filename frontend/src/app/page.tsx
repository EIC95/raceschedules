import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import type { Metadata } from 'next';
import { fetchUpcomingEvents } from '../api/events';
import { fetchChampionships } from '../api/championships';
import { fetchCategories } from '../api/categories';
import { fetchNextSession } from '../api/sessions';

export const metadata: Metadata = {
    title: "RaceSchedules - Home",
    description: "Your go-to calendar for motorsport schedules. Follow Formula 1, MotoGP, WEC, and many other racing series — all in one place, always up to date.",
    alternates: {
        canonical: "https://raceschedules.app/"
    },
    openGraph: {
        images: "https://raceschedules.app/og-image.png"
    }
};

export default async function HomePage() {
    // Fetch data on the server for SEO
    const [upcomingEvents, championships, categories, nextSession] = await Promise.all([
        fetchUpcomingEvents().catch(() => []),
        fetchChampionships().catch(() => []),
        fetchCategories().catch(() => []),
        fetchNextSession().catch(() => null),
    ]);

    return (
        <>
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <section>
                    <NextSession initialData={nextSession} />
                </section>
                <section className="mt-12">
                    <UpcomingEvents initialData={upcomingEvents} />
                </section>
                <section className="mt-16">
                    <Championships initialChampionships={championships} initialCategories={categories} />
                </section>
            </main>
        </>
    );
}
