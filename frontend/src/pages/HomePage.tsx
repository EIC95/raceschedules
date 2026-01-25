import TimezoneToggle from "../components/TimezoneToggle";
import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import Footer from "../components/Footer"; // Import Footer

export default function HomePage(){
    return(
        <main className="px-36 py-10">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1>
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
            <Footer />
        </main>
    )
}