import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://parniangostar.com/_next/static/media/imgFallBack.581a9fe3.png";
  return (
    <div
      className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-80 overflow-hidden">
        <img src={
          movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage
        } alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute right-2 top-2 bg-black bg-opacity-50 rounded-md px-2 py-1 text-white text-sm font-bold">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500 truncate">
          {movie.release_date} | {movie.original_language.toUpperCase()}
        </p>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3">
          {movie.overview.length > 100 ? `${movie.overview.slice(0, 100)}...` : movie.overview}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
