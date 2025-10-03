import { useEffect, useState, useParams } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import { MovieCard } from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  useEffect((): void => {
    const fetchMovies = async (): Promise<void> => {
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${params.category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  console.log(movies[0]?.adult);
  return (
    <>
      <div className="flex justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={page === 5}
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          Next
        </button>
      </div>
      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-10 ">
        {movies &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </>
  );
}
