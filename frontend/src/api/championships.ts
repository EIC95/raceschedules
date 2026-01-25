import api from './api';
import type { Category } from './categories';

export interface Championship {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category: Category;
}

export const fetchChampionships = async (categoryId?: number): Promise<Championship[]> => {
    try {
        const params = categoryId ? { category_id: categoryId } : {};
        const response = await api.get<Championship[]>('/championships', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching championships:', error);
        throw error;
    }
};
