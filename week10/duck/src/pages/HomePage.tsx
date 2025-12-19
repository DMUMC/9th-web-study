import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";

const HomePage = () => {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const axiosRequestConfig = useMemo(
    () => ({
      params: filters,
    }),
    [filters]
  );

  const { data, error, isLoading } = useFetch<MovieResponse>(
    "/search/movie",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white text-center">
            🎬 영화 검색
          </h1>
          <p className="text-center text-gray-300 mt-2">
            TMDB에서 영화를 검색하고 정보를 확인하세요
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <MovieFilter onChange={handleChangeMovieFilters} />

        {error ? (
          <div className="mt-8 bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-200 text-lg font-semibold">⚠️ {error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-white text-lg font-medium">
              영화를 검색하는 중...
            </p>
          </div>
        ) : (
          <div className="mt-8">
            {data && data.results && data.results.length > 0 && (
              <div className="mb-6 text-white">
                <p className="text-xl font-semibold">
                  검색 결과:{" "}
                  <span className="text-purple-300">{data.results.length}</span>
                  개
                </p>
              </div>
            )}
            <MovieList
              movies={data?.results || []}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}

        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default HomePage;
