import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SEO from "../components/SEO";

export default function HomePage(){

    return(
        <>
            <SEO 
                title="RaceSchedules - Home" 
                description="Your go-to calendar for motorsport schedules. Follow Formula 1, MotoGP, WEC, and many other racing series — all in one place, always up to date." 
                canonical="https://raceschedules.ibrahima.dev/" 
                image="https://raceschedules.ibrahima.dev/og-image.png"
            />
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-10">
                <Header />
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
