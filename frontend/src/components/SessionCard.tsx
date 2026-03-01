import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import type { Session } from '../api/sessions';
import SessionTimeDisplay from './SessionTimeDisplay';

dayjs.extend(localizedFormat);

interface SessionCardProps {
    session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const sessionDate = dayjs(session.start_time);
    const dayOfWeek = sessionDate.format('dddd').toUpperCase();
    const isPast = sessionDate.isBefore(dayjs());

    return (
        <div className="border-2 border-black p-4 mb-4 flex flex-col">
            <div className="flex justify-end mb-2">
                {isPast && (
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 w-fit">
                        COMPLETED
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center">
                    <span className="text-3xl md:text-4xl font-extrabold text-gray-300 mr-4">
                        {session.session_number}
                    </span>
                    <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-black uppercase leading-tight">
                            {session.name}
                        </h4>
                        <p className="text-gray-600 text-xs md:text-sm font-semibold uppercase">
                            {dayOfWeek}
                        </p>
                    </div>
                </div>
                <SessionTimeDisplay startTime={session.start_time} sessionTimezone={session.timezone} />
            </div>
        </div>
    );
};

export default SessionCard;