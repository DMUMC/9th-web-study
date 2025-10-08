// src/components/MovieCard.tsx
import { useState } from 'react';
import type { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps{
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return(
    <div
      onClick={(): void | Promise<void> => navigate(`/movie/${movie.id}`)}
      className="relative rounded-xl overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105 bg-black/40 shadow-lg"
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
      title={movie.title}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* 상단 좌측 평점 배지 (레퍼런스 무드) */}
      <div className="absolute top-2 left-2 text-[11px] px-2 py-0.5 rounded-full bg-black/70 text-yellow-300 border border-white/10">
        ⭐ {movie.vote_average?.toFixed?.(1) ?? '0.0'}
      </div>

      {/* 하단 그라데이션 (항상) */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* 호버 정보 + CTA */}
      {isHovered && (
        <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
          <h2 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow">
            {movie.title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-gray-300 line-clamp-1">{movie.release_date}</span>
            <span className="text-[11px] text-gray-400">·</span>
            <button
              className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/10"
            >
              상세보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

