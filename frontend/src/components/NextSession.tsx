import React, { useState, useEffect } from 'react';
import SessionTimeDisplay from './SessionTimeDisplay';
import CountdownTimer from './CountdownTimer';
import { fetchNextSession } from '../api/sessions';
import type { Session } from '../api/sessions'

const NextSession: React.FC = () => {
    const [nextSession, setNextSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getNextSession = async () => {
            try {
                setLoading(true);
                const data = await fetchNextSession();
                setNextSession(data);
            } catch (err) {
                setError('Failed to load next session. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getNextSession();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading next session...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!nextSession) {
        return <div className="text-center py-8">No upcoming sessions found.</div>;
    }

    return (
        <div className="border-4 border-black p-8 my-8">
            <p className="text-gray-600 text-sm font-bold mb-2">NEXT SESSION</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch flex-wrap"> {/* Responsive flex direction and alignment */}
                <div className="flex-1 min-w-full md:min-w-0 md:w-auto mb-4 md:mb-0"> {/* Take full width on small, then auto */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black uppercase leading-none mb-2"> {/* Responsive H2 */}
                        {nextSession.event.name}
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-lg font-semibold uppercase"> {/* Responsive P */}
                        {nextSession.event.championship.name} — {nextSession.name}
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end min-w-full md:min-w-0 mt-4 md:mt-auto"> {/* Take full width on small, then auto */}
                    <SessionTimeDisplay startTime={nextSession.start_time} sessionTimezone={nextSession.timezone} />
                    <CountdownTimer startTime={nextSession.start_time} />
                </div>
            </div>
        </div>
    );
};

export default NextSession;
