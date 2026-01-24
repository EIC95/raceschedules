import TimezoneToggle from "../components/TimezoneToggle";
import NextSession from "../components/NextSession";

export default function HomePage(){
    return(
        <main className="px-36 py-10">
            <header className="flex justify-end">
                <TimezoneToggle />
            </header>
            <section className="mt-10">
                <NextSession />
            </section>
        </main>
    )
}