"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

type Timezone = 'your_time' | 'track_time';

interface TimezoneContextType {
    selectedTimezone: Timezone;
    setSelectedTimezone: (timezone: Timezone) => void;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

interface TimezoneProviderProps {
    children: ReactNode;
}

export const TimezoneProvider: React.FC<TimezoneProviderProps> = ({ children }) => {
    const [selectedTimezone, setSelectedTimezone] = useState<Timezone>(() => {
        if (typeof window !== 'undefined') {
            const savedTimezone = localStorage.getItem('timezone');
            return (savedTimezone === 'your_time' || savedTimezone === 'track_time') ? savedTimezone : 'your_time';
        }
        return 'your_time';
    });

    useEffect(() => {
        localStorage.setItem('timezone', selectedTimezone);
    }, [selectedTimezone]);

    return (
        <TimezoneContext.Provider value={{ selectedTimezone, setSelectedTimezone }}>
            {children}
        </TimezoneContext.Provider>
    );
};

export const useTimezone = () => {
    const context = useContext(TimezoneContext);
    if (context === undefined) {
        throw new Error('useTimezone must be used within a TimezoneProvider');
    }
    return context;
};
