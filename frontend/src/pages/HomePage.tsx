import TimezoneToggle from "../components/TimezoneToggle";

export default function HomePage(){
    return(
        <main className="px-28 py-10">
            <header className="flex justify-end">
                <TimezoneToggle />
            </header>
        </main>
    )
}