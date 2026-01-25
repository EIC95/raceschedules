import { useEffect } from 'react';
import NextSession from "../components/NextSession";
import UpcomingEvents from "../components/UpcomingEvents";
import Championships from "../components/Championships";
import Footer from "../components/Footer";
import SeoHead from "../components/SeoHead";
import Header from "../components/Header";

export default function HomePage(){
    useEffect(() => {
        document.title = "Home | Race Schedules";
    }, []);

    return(
        <>
            <SeoHead title="Home" description="View upcoming race schedules and championships." />
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 py-10">
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
