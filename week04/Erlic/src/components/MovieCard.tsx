import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const { title, poster_path, overview } = movie;

  return (
    <Link to={`/movies/${movie.id}`}>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[2/3] overflow-hidden">
          {poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
              이미지 없음
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-lg font-semibold leading-snug">{title}</h3>
            <p className="text-sm text-white/80 line-clamp-5">{overview || "설명이 없습니다."}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
