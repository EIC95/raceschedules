import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categories';
import type { Category } from '../api/categories';
import { fetchChampionships } from '../api/championships';
import type { Championship } from '../api/championships';
import ChampionshipCard from './ChampionshipCard';

const Championships: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [allChampionships, setAllChampionships] = useState<Championship[]>([]);
    const [filteredChampionships, setFilteredChampionships] = useState<Championship[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [loadingChampionships, setLoadingChampionships] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await fetchCategories();
                setCategories([{ id: 0, name: 'ALL CATEGORIES' }, ...data]);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories.');
            } finally {
                setLoadingCategories(false);
            }
        };
        getCategories();
    }, []);

    useEffect(() => {
        const getAllChampionships = async () => {
            try {
                setLoadingChampionships(true);
                const data = await fetchChampionships();
                setAllChampionships(data);
            } catch (err) {
                console.error('Error fetching all championships:', err);
                setError('Failed to load championships.');
            } finally {
                setLoadingChampionships(false);
            }
        };
        getAllChampionships();
    }, []);

    useEffect(() => {
        if (selectedCategoryId === 0) {
            setFilteredChampionships(allChampionships);
        } else {
            setFilteredChampionships(
                allChampionships.filter(champ => champ.category_id === selectedCategoryId)
            );
        }
    }, [selectedCategoryId, allChampionships]);


    if (loadingCategories || loadingChampionships) {
        return <div className="text-center py-8">Loading championships...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="my-8">
            <h2 className="text-2xl font-extrabold text-black uppercase mb-6">Championships</h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-4 py-1.5 text-sm font-bold uppercase border-2 transition-colors duration-200 ease-in-out
                                    ${selectedCategoryId === category.id
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black cursor-pointer'} `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChampionships.map(championship => (
                    <ChampionshipCard key={championship.id} championship={championship} />
                ))}
            </div>
        </section>
    );
};

export default Championships;
