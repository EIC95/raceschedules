import api from './api';

interface Championship {
    name: string;
    slug: string;
    id: number;
    category_id: number;
}

export interface Event {
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    id: number;
    championship_id: number;
    championship?: Championship; 
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
