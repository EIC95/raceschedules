import Image from "next/image";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 py-8 bg-white">
        <hr className="border-t border-black w-full mb-6" />

        <div className="flex flex-col gap-6">
            
            <p className="text-sm text-gray-600 max-w-2xl font-bold">
                Motorsport never sleeps. From Formula 1 to MotoGP, WEC to NASCAR,
                there's always a session happening somewhere in the world.
                RaceSchedules brings a wide range of championship calendars into one place — open and kept alive by a community of motorsport fans.
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>© {currentYear} RACESCHEDULES</span>

                <a
                href="https://ko-fi.com/X8X511TO4J"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition flex items-center"
                >
                <img
                    src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
                    alt="Support me on Ko-fi"
                    className="h-7 w-auto"
                />
                </a>
            </div>

            <a
                href="https://github.com/EIC95/raceschedules"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
            >
                <Image
                src="/github.svg"
                alt="github icon"
                width={30}
                height={30}
                className="w-7 opacity-70 hover:opacity-100 transition"
                />
            </a>
            </div>
        </div>
        </footer>
    );
};

export default Footer;