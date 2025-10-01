import { useState } from "react";
import type { Movie } from "../types/movies";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer
      w-44 transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className="rounded-2xl"
      />
      {isHovered && (
        <div className="p-2 absolute inset-0 bg-gradient-to-t from-black/90
        to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white
        leading-snug">
          <h2>{movie.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2
          line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  )
}