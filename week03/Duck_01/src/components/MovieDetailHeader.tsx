import type { MovieDetailT } from "../types/types";

interface MovieDetailHeaderProps {
  movie: MovieDetailT;
}

export const MovieDetailHeader = ({ movie }: MovieDetailHeaderProps) => {
  return (
    <div
      className="relative w-full h-96 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="container mx-auto h-full flex items-end p-8">
        <div className="flex gap-8">
          {/* 포스터 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 h-96 object-cover rounded-xl shadow-2xl"
          />

          {/* 기본 정보 */}
          <div className="flex flex-col justify-end text-white pb-4">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl italic text-gray-300 mb-4">
                {movie.tagline}
              </p>
            )}
            <div className="flex gap-4 items-center mb-4">
              <span className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-bold">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-300">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </span>
              <span className="text-gray-300">|</span>
              <span>{movie.release_date}</span>
              <span className="text-gray-300">|</span>
              <span>{movie.runtime}분</span>
            </div>
            <div className="flex gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-emerald-600 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
