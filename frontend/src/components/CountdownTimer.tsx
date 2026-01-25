import React, { useState, useEffect } from 'react';

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

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const formatTime = (time: number) => String(time).padStart(2, '0');

    return (
        <div className="flex items-end justify-center text-4xl md:text-5xl font-bold text-black tracking-tighter">
            <div className="flex flex-col items-center">
                <span>{formatTime(timeLeft.days)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-500">DAYS</span>
            </div>
            <span className="mb-5 mx-2 text-gray-300">:</span>
            <div className="flex flex-col items-center">
                <span>{formatTime(timeLeft.hours)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-500">HRS</span>
            </div>
            <span className="mb-5 mx-2 text-gray-300">:</span>
            <div className="flex flex-col items-center">
                <span>{formatTime(timeLeft.minutes)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-500">MINS</span>
            </div>
            <span className="mb-5 mx-2 text-gray-300">:</span>
            <div className="flex flex-col items-center">
                <span>{formatTime(timeLeft.seconds)}</span>
                <span className="text-xs tracking-normal font-semibold text-gray-500 uppercase">Secs</span>
            </div> 
        </div>
    );
};

export default CountdownTimer;