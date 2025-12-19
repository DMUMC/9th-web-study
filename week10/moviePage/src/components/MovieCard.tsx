import { memo } from 'react';

export type Movie = {
    id: number;
    title: string;
    original_title?: string;
    overview: string;
    release_date?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    original_language?: string;
    popularity?: number;
    vote_count?: number;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

type MovieCardProps = {
    movie: Movie;
    onSelect?: (movie: Movie) => void;
};

const MovieCardComponent = ({ movie, onSelect }: MovieCardProps) => {
    console.log(`MovieCard render - ${movie.title}`);

    return (
        <article
            className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg'
            onClick={() => onSelect?.(movie)}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(movie);
                }
            }}
        >
            <div className='relative aspect-[2/3] w-full overflow-hidden bg-slate-100'>
                {movie.poster_path ? (
                    <img
                        alt={movie.title}
                        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                    />
                ) : (
                    <div className='flex h-full w-full items-center justify-center text-xs text-slate-400'>
                        No Image
                    </div>
                )}
                {typeof movie.vote_average === 'number' && (
                    <span className='absolute right-2 top-2 rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm'>
                        {movie.vote_average.toFixed(1)}
                    </span>
                )}
            </div>

            <div className='flex flex-1 flex-col gap-2 px-4 py-3'>
                <h3 className='line-clamp-2 text-sm font-semibold text-slate-900'>{movie.title}</h3>
                <div className='flex items-center gap-2 text-xs text-slate-500'>
                    {movie.release_date && <span>{movie.release_date}</span>}
                    {movie.original_language && (
                        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700'>
                            {movie.original_language}
                        </span>
                    )}
                </div>
                <p className='line-clamp-2 text-xs leading-relaxed text-slate-600'>
                    {movie.overview || '줄거리가 제공되지 않습니다.'}
                </p>
            </div>
        </article>
    );
};

export const MovieCard = memo(MovieCardComponent);
