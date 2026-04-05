import Image from 'next/image';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 py-10 bg-white space-y-5"> {/* Responsive padding */}
            <hr className="border-t-2 border-black w-full mt-4" />
            <p className='text-justify text-sm text-gray-600 font-bold'>Motorsport never sleeps. From Formula 1 to MotoGP, WEC to NASCAR, there's always a session happening somewhere in the world. RaceSchedules brings a wide range of championship calendars into one place — open, and kept alive by a community of motorsport fans.</p>
            <div className="flex justify-between items-center text-sm text-gray-600 font-bold">
                <p>© {currentYear} RACESCHEDULES</p>
                <a
                    href="https://github.com/EIC95/raceschedules"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                >
                    <Image src="/github.svg" alt="github icon" width={24} height={24} className='w-6' />
                </a>
            </div>
        </footer>
    );
};

export default Footer;