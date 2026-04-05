const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 py-8 bg-white dark:bg-neutral-950">
            <hr className="border-t border-gray-100 dark:border-neutral-800 w-full mb-6" />
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-neutral-500">
                    <span>© {currentYear} RACESCHEDULES</span>
                    <a
                        href="https://ko-fi.com/X8X511TO4J"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <img
                            src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
                            alt="Support on Ko-fi"
                            className="h-6 w-auto"
                        />
                    </a>
                </div>
                <a
                    href="https://github.com/EIC95/raceschedules"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                    className="opacity-40 hover:opacity-100 transition-opacity dark:invert"
                >
                    <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
