import { useParams } from 'react-router-dom';
import type { MovieDetail } from '../types/movie';
import LoadingSpinner from '../components/LoadingSpinner';
import type { MovieCreditsResponse } from '../types/cast';
import CastCard from '../components/CastCard';
import { useCustomFetch } from '../hooks/useCustomFetch';

const MovieDetailPage = () => {
    const { movieId } = useParams();

    const {
        data: movieDetails,
        isPending: isDetailsPending,
        isError: isDetailsError,
    } = useCustomFetch<MovieDetail>(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
        [movieId]
    );

    const {
        data: creditsData,
        isPending: isCreditsPending,
        isError: isCreditsError,
    } = useCustomFetch<MovieCreditsResponse>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
        [movieId]
    );

    const movieCasts = creditsData?.cast || [];
    const isPending = isDetailsPending || isCreditsPending;
    const isError = isDetailsError || isCreditsError;

    if (isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>
                    에러가 발생했습니다.
                </span>
            </div>
        );
    }

    return (
        <>
            {isPending && (
                <div className='flex items-center justify-center h-dvh'>
                    <LoadingSpinner />
                </div>
            )}

            {!isPending && movieDetails && (
                <div className='relative min-h-dvh text-white overflow-hidden'>
                    <div
                        className='absolute inset-0 -z-10 bg-cover bg-center opacity-40 transition-all duration-1000 hover:opacity-60'
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`,
                        }}
                    />

                    <div className='max-w-6xl mx-auto px-6 py-12'>
                        <div className='flex flex-col md:flex-row gap-8 animate-fade-in-up'>
                            <div className='transform transition-all duration-500 hover:scale-105 hover:rotate-1'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                                    alt={movieDetails.title}
                                    className='w-72 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500'
                                />
                            </div>

                            <div className='flex-1 space-y-4 animate-slide-in-right'>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2 transform transition-all duration-500 hover:scale-105'>
                                    {movieDetails.title}
                                </h1>
                                <p className='text-lg text-gray-300 italic mb-4 animate-pulse'>
                                    {movieDetails.tagline}
                                </p>
                                <p className='text-gray-200 mb-4 flex items-center gap-2'>
                                    <span className='bg-blue-600 px-3 py-1 rounded-full text-sm font-medium'>
                                        {movieDetails.release_date}
                                    </span>
                                    <span className='text-gray-400'>·</span>
                                    <span className='bg-green-600 px-3 py-1 rounded-full text-sm font-medium'>
                                        {movieDetails.runtime}분
                                    </span>
                                    <span className='text-gray-400'>·</span>
                                    <span className='bg-yellow-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                        ⭐ {movieDetails.vote_average}
                                    </span>
                                </p>
                                <div className='flex flex-wrap gap-2 mb-6'>
                                    {movieDetails.genres.map((genre, index) => (
                                        <span
                                            key={genre.id}
                                            className='bg-gradient-to-r from-indigo-600 to-purple-600 text-sm px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer'
                                            style={{
                                                animationDelay: `${
                                                    index * 100
                                                }ms`,
                                                animation:
                                                    'bounce-in 0.6s ease-out forwards',
                                            }}
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                                <p className='leading-relaxed text-gray-200 mb-6 text-lg bg-black/20 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-500'>
                                    {movieDetails.overview}
                                </p>
                            </div>
                        </div>

                        {!isPending && (
                            <div className='mt-8'>
                                <h2 className='text-2xl font-bold mb-4 text-center'>
                                    출연진
                                </h2>
                                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                                    {movieCasts.map((cast) => (
                                        <CastCard key={cast.id} cast={cast} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MovieDetailPage;
