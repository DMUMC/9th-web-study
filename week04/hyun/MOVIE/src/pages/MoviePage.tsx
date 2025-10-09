import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useFetchMovies } from '../hooks/useFetchMovies';

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string | undefined }>();
    const { movies, isPending, isError } = useFetchMovies(category || '', page);

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
                <div className="fnlex items-center justify-center h-dvh">
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
