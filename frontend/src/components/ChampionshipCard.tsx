import React from 'react';
import { Link } from 'react-router-dom';
import type { Championship } from '../api/championships';

interface ChampionshipCardProps {
    championship: Championship;
}

const ChampionshipCard: React.FC<ChampionshipCardProps> = ({ championship }) => {
    return (
        <Link to={`/championships/${championship.slug}`} className="block">
            <div className="border-2 border-black p-4 h-36 flex items-center justify-center text-center
                            transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                <h3 className="text-xl font-extrabold uppercase leading-tight">
                    {championship.name}
                </h3>
            </div>
        </Link>
    );
};

export default ChampionshipCard;
