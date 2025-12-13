import { useCallback, useMemo, useState } from 'react';
import MovieFilter from '../components/MovieFilter';
import MovieList from '../components/MovieList';
import MovieModal from '../components/MovieModal';
import useFetch from '../hooks/useFetch';
import type {
    Movie,
    MovieFilters,
    MovieResponse,
} from '../types/movie';

const HomePage = () => {
    const [filters, setFilters] = useState<MovieFilters>({
        query: '어벤져스',
        include_adult: false,
        language: 'ko-KR',
    });
    const [selectedMovie, setSelectedMovie] =
        useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const axiosRequestConfig = useMemo(
        () => ({
            params: filters,
        }),
        [filters]
    );

    const { data, error, isLoading } =
        useFetch<MovieResponse>(
            '/search/movie',
            axiosRequestConfig
        );

    const handleChangeMovieFilters = useCallback(
        (filters: MovieFilters) => {
            setFilters(filters);
        },
        [setFilters]
    );

    const handleMovieClick = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <MovieFilter
                onChange={handleChangeMovieFilters}
            />
            {isLoading ? (
                <div className='text-center py-8'>
                    로딩 중...
                </div>
            ) : (
                <MovieList
                    movies={data?.results || []}
                    onMovieClick={handleMovieClick}
                />
            )}
            <MovieModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default HomePage;
