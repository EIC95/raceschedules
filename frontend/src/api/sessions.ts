import api from './api';

interface Championship {
    name: string;
    slug: string;
    id: number;
    category_id: number;
}

interface Event {
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    id: number;
    championship_id: number;
    championship: Championship;
}

export interface Session {
    name: string;
    start_time: string;
    session_number: number;
    id: number;
    event_id: number;
    event: Event;
    timezone: string;
}

export const fetchNextSession = async (): Promise<Session | null> => {
    try {
        const response = await api.get<Session>('/sessions/next');
        return response.data;
    } catch (error) {
        console.error('Error fetching next session:', error);
        throw error;
    }
};
