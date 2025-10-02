import { useEffect, useState } from "react"
import axios from "axios";
import { type MovieResponse, type Movie } from "../types/movies";
import MovieCard from "../components/MovieCard";
import { Pagination } from "../components/Pagination";
import { usePage } from "../contexts/PageProvider";
import { useParams } from "react-router-dom";
import { LoadingComponent } from "../components/LoadingComponent";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPage, setTotalPage] = useState<number>();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const { page } = usePage();
  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);

      try{
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );
        setMovies(data.results);
        setTotalPage(data.total_pages);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchMovies();
  }, [page, category]);

  if (isError) {
    return ( 
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <Pagination totalPage={totalPage} />
      <LoadingComponent isPending={isPending}>
        {movies && movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </LoadingComponent>      
    </>
  );
};