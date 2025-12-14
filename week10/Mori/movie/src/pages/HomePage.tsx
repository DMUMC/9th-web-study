import { MovieList } from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import useFetch from "../hooks/useFetch";
import type { MovieResponse } from "../types/movie";

export default function HomePage() {
  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", {
    params: {
      query: "코난",
      include_adult: false,
      language: "ko-KR",
    },
  });

  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container">
      <MovieFilter />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  )
}