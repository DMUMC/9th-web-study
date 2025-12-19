import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieList = ({ movies, onMovieClick }: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-60 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <p className="text-6xl mb-4">🎭</p>
        <p className="font-bold text-white text-xl">검색 결과가 없습니다</p>
        <p className="text-gray-400 mt-2">다른 검색어를 시도해보세요</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
};

export default MovieList;
