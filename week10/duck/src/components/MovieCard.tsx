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
      className="group overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-all hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer transform hover:-translate-y-2"
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
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg flex items-center gap-1">
          <span>⭐</span>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-5 bg-white/5 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-300 mb-3">{movie.release_date}</p>
        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
          {movie.overview.length > 100
            ? movie.overview.slice(0, 100) + "..."
            : movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
