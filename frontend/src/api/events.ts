import api from './api';
import type { Session } from './sessions';
import type { Championship } from './championships';

export interface Event {
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    id: number;
    championship_id: number;
    championship?: Championship;
}

export interface EventDetail {
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    id: number;
    championship_id: number;
    championship?: Championship;
    sessions: Session[];
}

export const fetchUpcomingEvents = async (): Promise<Event[]> => {
    try {
        const response = await api.get<Event[]>('/events/upcoming');
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
    }
};

export const fetchEventDetails = async (slug: string): Promise<EventDetail> => {
    try {
        const response = await api.get<EventDetail>(`/events/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for event ${slug}:`, error);
        throw error;
    }
};