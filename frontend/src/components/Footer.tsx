import Image from 'next/image';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-14 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 py-10 bg-white"> {/* Responsive padding */}
            <hr className="border-t-2 border-black w-full mb-8" />
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