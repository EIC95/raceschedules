import { useEffect } from 'react'; // Removed React import
import TimezoneToggle from "../components/TimezoneToggle";
import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";

export default function HomePage(){
    useEffect(() => {
        document.title = "Home | Race Schedules";
    }, []);

    return(
        <>
            <SeoHead title="Home" description="View upcoming race schedules and championships." />
            <main className="px-36 py-10">
                <header className="flex justify-between items-center">
                    <a href="/"><h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1></a>
                    <TimezoneToggle />
                </header>
                <section className="mt-14">
                    <NextSession />
                </section>
                <section className="mt-14">
                    <UpcomingEvents />
                </section>
                <section className="mt-14">
                    <Championships />
                </section>
            </main>
            <Footer />
        </>
    )
}