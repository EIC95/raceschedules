"use client";
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    startTime: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!startTime) return;

        const targetDate = new Date(startTime + 'Z').getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    const fmt = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="flex items-end gap-1 text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tighter tabular-nums">
            <div className="flex flex-col items-center">
                <span>{fmt(timeLeft.days)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-400 dark:text-gray-500">D</span>
            </div>
            <span className="mb-4 text-gray-200 dark:text-neutral-700">:</span>
            <div className="flex flex-col items-center">
                <span>{fmt(timeLeft.hours)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-400 dark:text-gray-500">H</span>
            </div>
            <span className="mb-4 text-gray-200 dark:text-neutral-700">:</span>
            <div className="flex flex-col items-center">
                <span>{fmt(timeLeft.minutes)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-400 dark:text-gray-500">M</span>
            </div>
            <span className="mb-4 text-gray-200 dark:text-neutral-700">:</span>
            <div className="flex flex-col items-center">
                <span>{fmt(timeLeft.seconds)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-400 dark:text-gray-500">S</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
