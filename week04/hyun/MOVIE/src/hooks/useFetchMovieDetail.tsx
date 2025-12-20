// src/hooks/useFetchMovieDetail.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { MovieDetail } from '../types/Movie';

export function useFetchMovieDetail(movieId: string | undefined) {
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!movieId) {
                setIsError(true);
                setIsPending(false);
                return;
            }

            setIsPending(true);
            setIsError(false); // 새로운 요청 시 에러 상태 초기화

            try {
                const { data } = await axios.get<MovieDetail>(
                    `/api/movie/${movieId}?language=ko-KR&append_to_response=credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                import.meta.env.VITE_TMDB_KEY
                            }`,
                        },
                    }
                );
                setMovie(data);
            } catch (err) {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieDetail();
    }, [movieId]);

    return { movie, isPending, isError };
}
