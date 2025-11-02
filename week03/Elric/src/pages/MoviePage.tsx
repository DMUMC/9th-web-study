import { useEffect, useState } from "react";
import axios from "axios";
import { tmdb } from "../api/tmdb";
import type { Movie, MoviesResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = {
  category: "popular" | "upcoming" | "top_rated" | "now_playing";
};

const TMDB_BASE = "https://api.themoviedb.org/3";

export default function MoviePage({ category }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [iserror, setISError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      setISError(false);

      try {
        const { data } = await axios.get<MoviesResponse>(
          `${TMDB_BASE}/movie/${category}?language=ko-kr&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              Accept: "application/json",
            },
          }
        );
        setMovies(data.results ?? []);
      } catch {
        setISError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (iserror) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-slate-300"
        >
          {"<"}
        </button>
        <span className="text-lg">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
        >
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 p-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
}
