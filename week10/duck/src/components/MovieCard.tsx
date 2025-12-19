import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://placehold.co/600x400";

  return (
    <div
      className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `${imageBaseUrl}${movie.poster_path}`
              : fallbackImage
          }
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-5 bg-white">
        <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 font-medium">
          📅 {movie.release_date}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {movie.overview.length > 100
            ? movie.overview.slice(0, 100) + "..."
            : movie.overview}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
