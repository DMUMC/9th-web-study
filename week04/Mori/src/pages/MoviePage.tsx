import { type MovieResponse } from "../types/movies";
import MovieCard from "../components/MovieCard";
import { Pagination } from "../components/Pagination";
import { usePage } from "../contexts/PageProvider";
import { useParams } from "react-router-dom";
import { LoadingComponent } from "../components/LoadingComponent";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  const { page } = usePage();
  const { category } = useParams<{ category: string }>();

  const { data: movieResponse, isPending, isError } = useCustomFetch<MovieResponse>(
    `/movie/${category}?language=en-US&page=${page}`
  );

  if (isError) {
    return ( 
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500 text-2xl">데이터를 불러오는 중 에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      {movieResponse && <Pagination totalPage={movieResponse.total_pages} />}
      
      <LoadingComponent isPending={isPending}>
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movieResponse?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </LoadingComponent>       
    </>
  );
};