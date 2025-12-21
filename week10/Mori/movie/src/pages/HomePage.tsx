import { useState } from "react";
import { MovieList } from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { MovieResponse } from "../types/movie";
import type { Movie } from "../types/movie";

export default function HomePage() {
  const [query, setQuery] = useState("코난");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", {
    params: {
      query,
      include_adult: includeAdult,
      language,
    },
  });

  const handleFilterChange = (filters: {
    query: string;
    includeAdult: boolean;
    language: string;
  }) => {
    setQuery(filters.query || "코난");
    setIncludeAdult(filters.includeAdult);
    setLanguage(filters.language);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container">
      <MovieFilter onFilterChange={handleFilterChange} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MovieList
          movies={data?.results || []}
          onMovieClick={handleMovieClick}
        />
      )}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}