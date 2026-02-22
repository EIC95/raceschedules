import Link from 'next/link';
import TimezoneToggle from './TimezoneToggle';

const Header: React.FC = () => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-2 sm:gap-4">
            <Link href="/"><h1 className="text-2xl font-extrabold text-black uppercase">RACESCHEDULES</h1></Link>
            <TimezoneToggle />
        </header>
    );
};

export default Header;
