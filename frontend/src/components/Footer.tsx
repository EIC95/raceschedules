import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-14 py-10 bg-white">
            <hr className="border-t-2 border-black w-full mb-8" />
            <div className="flex justify-between items-center text-sm text-gray-600 font-bold">
                <p>© {currentYear} RACESCHEDULES</p>
                <a
                    href="https://github.com/EIC95/raceschedules"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                >
                    <img src="/github.svg" alt="github icon" className='w-6'/>
                </a>
            </div>
        </footer>
    );
};

export default Footer;