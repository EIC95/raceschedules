"use client";
import { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categories';
import type { Category } from '../api/categories';
import { fetchChampionships } from '../api/championships';
import type { Championship } from '../api/championships';
import ChampionshipCard from './ChampionshipCard';
import { AlertCircle, Loader2 } from 'lucide-react';

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
                setCategories([{ id: 0, name: 'All' }, ...data]);
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
        return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center py-10">
                <h2 className="text-2xl font-extrabold text-black dark:text-white uppercase mb-6">
                    Championships
                </h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <AlertCircle className="w-4 h-4 opacity-60" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <section>
            <h2 className="text-2xl font-extrabold text-black dark:text-white uppercase mb-6">Championships</h2>

            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-3 py-1 text-xs font-bold uppercase border transition-colors duration-200 cursor-pointer
                            ${selectedCategoryId === category.id
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-neutral-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'}`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredChampionships.length > 0
                    ? filteredChampionships.map(championship => (
                        <ChampionshipCard key={championship.id} championship={championship} />
                    ))
                    : <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">No championships found.</p>
                }
            </div>
        </section>
    );
};

export default Championships;
