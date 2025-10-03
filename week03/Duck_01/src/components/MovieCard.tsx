import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate, useParams } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div
      onClick={() => {
        navigate(`/movies/${movie.id}`);
      }}
      className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer w-44 transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={`https://image.tmdb.org//t/p/w200${movie.poster_path}`}
        alt={`${movie.title}의 이미지`}
      />

      {isHover && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center p-4 text-white">
          <h2 className="text-lg font-bold leading-snug">{movie.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
