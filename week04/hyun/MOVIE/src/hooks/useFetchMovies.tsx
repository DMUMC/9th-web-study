// src/hooks/useFetchMovies.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/Movie';

export function useFetchMovies(category: string, page: number) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            setIsError(false); // 새로운 요청 시 에러 상태 초기화

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
                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        if (category) {
            fetchMovies();
        }
    }, [category, page]);

    return { movies, isPending, isError };
}
