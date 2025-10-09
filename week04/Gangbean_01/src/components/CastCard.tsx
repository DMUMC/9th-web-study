import type { Cast } from '../types/cast';

interface CastCardProps {
    cast: Cast;
}

const CastCard = ({ cast }: CastCardProps) => {
    return (
        <div key={cast.id} className='flex flex-col items-center'>
            <img
                src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                alt={cast.name}
                className='w-full rounded-md'
            />
            <h3 className='mt-2 text-sm font-semibold text-white text-center'>
                {cast.name}
            </h3>
            <p className='text-xs text-gray-300 text-center'>
                {cast.character}
            </p>
        </div>
    );
};

export default CastCard;
