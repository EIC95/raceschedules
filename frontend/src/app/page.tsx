import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import type { Metadata } from 'next';
import { fetchUpcomingEvents } from '../api/events';
import { fetchChampionships } from '../api/championships';
import { fetchCategories } from '../api/categories';
import { fetchNextSession } from '../api/sessions';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "RaceSchedules | The Ultimate Motorsport Calendar",
    description: "Looking for a website to see every motorsport schedule in one place? RaceSchedules is your ultimate motorsport calendar for F1, MotoGP, WEC, NASCAR, and more.",
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
                <section className="mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white uppercase leading-none mb-4 tracking-tight">
                        The Ultimate <br className="hidden sm:block" /> Motorsport Calendar
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium max-w-3xl">
                        The only website you need to see every motorsport schedule in one place. Track all your favorite racing series including Formula 1, MotoGP, WEC, and NASCAR.
                    </p>
                </section>
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
