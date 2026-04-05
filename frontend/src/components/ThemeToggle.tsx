"use client";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 cursor-pointer"
        >
            {/* Sun shows in dark mode (click to go light), Moon shows in light mode (click to go dark) */}
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
        </button>
    );
}
