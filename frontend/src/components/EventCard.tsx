import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import type { Event } from '../api/events'; 

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    let dateRange = startDate.format('MMM DD').toUpperCase();
    if (startDate.month() === endDate.month()) {
        if (startDate.date() !== endDate.date()) {
            dateRange = `${startDate.format('MMM DD')} - ${endDate.format('DD')}`.toUpperCase();
        }
    } else {
        dateRange = `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}`.toUpperCase();
    }

    return (
        <Link to={`/events/${event.slug}`} className="block">
            <div className="relative border-2 border-black p-4 h-40 flex flex-col justify-between transition-transform duration-200 ease-in-out hover:translate-x-1 hover:-translate-y-1">
                <div className="flex justify-between items-start">
                    <span className="bg-black text-white text-xs font-bold px-2 py-1">
                        {dateRange}
                    </span>
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-black uppercase leading-tight">
                        {event.name}
                    </h3>
                    {event.championship && (
                        <p className="text-gray-600 text-sm font-semibold uppercase">
                            {event.championship.name}
                        </p>
                    )}
                </div>
                <div className="self-end">
                    <ChevronRight size={24} className="text-black" />
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
