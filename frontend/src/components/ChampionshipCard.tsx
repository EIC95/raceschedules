import Link from 'next/link';
import type { Championship } from '../api/championships';

interface ChampionshipCardProps {
    championship: Championship;
}

const ChampionshipCard: React.FC<ChampionshipCardProps> = ({ championship }) => {
    return (
        <Link href={`/championships/${championship.slug}`} className="block group">
            <div className={`border border-gray-200 dark:border-neutral-800 p-4 h-32 flex flex-col items-center justify-center text-center
                            transition-colors duration-200 ease-in-out
                            group-hover:bg-black dark:group-hover:bg-white group-hover:border-black dark:group-hover:border-white`}>
                {championship.category?.name && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase group-hover:text-gray-300 dark:group-hover:text-gray-600 transition-colors mb-1">
                        {championship.category.name}
                    </span>
                )}
                <h3 className="text-base font-extrabold text-black dark:text-white uppercase leading-tight group-hover:text-white dark:group-hover:text-black transition-colors">
                    {championship.name}
                </h3>
            </div>
        </Link>
    );
};

export default ChampionshipCard;
