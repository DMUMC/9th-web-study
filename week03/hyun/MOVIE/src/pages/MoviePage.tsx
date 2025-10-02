import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/Movie';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태
    const [isError, setIsError] = useState(false);
    // 3. 페이지
    const [page, setPage] = useState(1);

    const { category } = useParams<{
        category: string;
    }>();

    useEffect((): void => {
        const fetchMovies = async (): Promise<void> => {
            setIsPending(true);
            try {
                const { data } = await axios.get<MovieResponse>(
                    `/api/movie/${category}?language=ko-kr&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                import.meta.env.VITE_TMDB_KEY
                            }`,
                        },
                    }
                );

                console.log(data);
                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [page, category]);

    if (isError) {
        return <span className="text-red-500 text-2xl">에러</span>;
    }
    return (
        <div>
            <div className="flex item-center justify-center gap-6 mt-5">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="text-white"
                >{`<`}</button>
                <span className="text-white">{page}페이지</span>
                <button
                    onClick={() => setPage((next) => next + 1)}
                    className="text-white"
                >{`>`}</button>
            </div>
            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}
            {!isPending && (
                <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
