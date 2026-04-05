import Link from 'next/link';
import TimezoneToggle from './TimezoneToggle';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 flex items-center justify-between h-14">
                <Link
                    href="/"
                    className="text-xl font-extrabold text-black dark:text-white uppercase tracking-tight hover:opacity-70 transition-opacity duration-200"
                >
                    RACESCHEDULES
                </Link>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <div className="w-px h-4 bg-gray-200 dark:bg-neutral-700 mx-1" />
                    <TimezoneToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
