import { useCustomFetch } from "./useCustomFetch";
import type { MovieDetailT, CreditResponseT } from "../types/types";

interface UseMovieDetailReturn {
  movie: MovieDetailT | null;
  creditCast: any[] | null;
  creditCrew: any[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMovieDetail = (
  movieId: string | undefined
): UseMovieDetailReturn => {
  // 영화 상세 정보 가져오기
  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
    refetch: refetchMovie,
  } = useCustomFetch<MovieDetailT>({
    url: `/movie/${movieId}`,
    params: {
      language: "ko-KR",
    },
    enabled: !!movieId,
  });

  // 크레딧 정보 가져오기
  const {
    data: creditResponse,
    loading: creditLoading,
    error: creditError,
    refetch: refetchCredit,
  } = useCustomFetch<CreditResponseT>({
    url: `/movie/${movieId}/credits`,
    params: {
      language: "ko-KR",
    },
    enabled: !!movieId,
  });

  const refetch = () => {
    refetchMovie();
    refetchCredit();
  };

  return {
    movie: movie || null,
    creditCast: creditResponse?.cast || null,
    creditCrew: creditResponse?.crew || null,
    loading: movieLoading || creditLoading,
    error: movieError || creditError,
    refetch,
  };
};
