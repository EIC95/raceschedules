import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import Footer from "../components/Footer";
import type { Metadata } from 'next';

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

export default function HomePage() {
    return (
        <>
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <section>
                    <NextSession />
                </section>
                <section className="mt-12">
                    <UpcomingEvents />
                </section>
                <section className="mt-16">
                    <Championships />
                </section>
                <section className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                        Motorsport never sleeps. From Formula 1 to MotoGP, WEC to NASCAR, there&apos;s always a session
                        happening somewhere in the world. RaceSchedules brings a wide range of championship calendars
                        into one place — open and kept alive by a community of motorsport fans.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
