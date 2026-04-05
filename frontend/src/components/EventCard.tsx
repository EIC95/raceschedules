import Link from 'next/link';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import type { Event } from '../api/events';

interface EventCardProps {
    event: Event;
    isPast?: boolean;
    isNext?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast = false, isNext = false }) => {
    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    let dateRange = startDate.format('MMM DD').toUpperCase();
    if (startDate.month() === endDate.month()) {
        if (startDate.date() !== endDate.date()) {
            dateRange = `${startDate.format('MMM DD')} – ${endDate.format('DD')}`.toUpperCase();
        }
    } else {
        dateRange = `${startDate.format('MMM DD')} – ${endDate.format('MMM DD')}`.toUpperCase();
    }

    return (
        <Link href={`/events/${event.slug}`} className="block group">
            <div className={`relative border p-4 h-40 flex flex-col justify-between transition-all duration-200
                ${isNext
                    ? 'border-black dark:border-white'
                    : 'border-gray-200 dark:border-neutral-800 group-hover:border-black dark:group-hover:border-white'}
                ${isPast ? 'opacity-50' : ''}
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>

                {/* Next event accent bar */}
                {isNext && (
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-black dark:bg-white" />
                )}

                <div className="flex justify-between items-start">
                    <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1">
                        {dateRange}
                    </span>
                    <div className="flex gap-1">
                        {isNext && !event.cancelled && !event.postponed && (
                            <span className="border border-black dark:border-white text-black dark:text-white text-xs font-bold px-2 py-1">
                                NEXT
                            </span>
                        )}
                        {event.cancelled && (
                            <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1">
                                CANCELLED
                            </span>
                        )}
                        {!event.cancelled && event.postponed && !isPast && (
                            <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1">
                                POSTPONED
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-black dark:text-white uppercase leading-tight">
                        {event.name}
                    </h3>
                    {event.championship && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">
                            {event.championship.name}
                        </p>
                    )}
                </div>

                <div className="self-end">
                    <ChevronRight size={20} className="text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
