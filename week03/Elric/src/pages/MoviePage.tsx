import { useEffect, useState } from "react";

import axios from "axios";
import type { Movie, MoviesResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MoviesResponse>(
        "https://api.themoviedb.org/3/movie/popular?language=ko-kr&page=1",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            Accept: "application/json",
          },
        }
      );

      setMovies(data.results);
      
    };

    fetchMovies();
  }, []);
  console.log(movies[0]?.adult);

  return (
    <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
