import api from './api';
import type { Category } from './categories';

// Interface for events without championship details, to avoid redundancy in ChampionshipDetail
export interface EventWithoutChampionship {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    championship_id: number | null;
}

// Interface for a championship with its full details, including events
export interface ChampionshipDetail {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category: Category;
    events: EventWithoutChampionship[]; // List of events without nested championship
}

// Existing Championship interface (from ChampionshipRead)
export interface Championship {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category: Category;
}

export const fetchChampionships = async (): Promise<Championship[]> => {
    try {
        const response = await api.get<Championship[]>('/championships');
        return response.data;
    } catch (error) {
        console.error('Error fetching championships:', error);
        throw error;
    }
};

export const fetchChampionshipDetails = async (slug: string): Promise<ChampionshipDetail> => {
    try {
        const response = await api.get<ChampionshipDetail>(`/championships/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for championship ${slug}:`, error);
        throw error;
    }
};