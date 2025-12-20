import { LoadingComponent } from "../components/LoadingComponent";
import { type MovieCredits, type MovieDetails } from "../types/movies";
import { useParams } from "react-router-dom";
import { MovieInfo } from "../components/MovieInfo";
import { MovieCreditInfo } from "../components/MovieCreditInfo";
import { useCustomFetch } from "../hooks/useCustomFetch";

export const MovieDetailPage = () => {
  const { movieId } = useParams();

  const { data: details, isPending: isDetailsPending, isError: isDetailsError } = useCustomFetch<MovieDetails>(
    `/movie/${movieId}?language=ko-KR`
  );

  const { data: credits, isPending: isCreditsPending, isError: isCreditsError } = useCustomFetch<MovieCredits>(
    `/movie/${movieId}/credits?language=ko-KR`
  );

  const isPending = isDetailsPending || isCreditsPending;
  const isError = isDetailsError || isCreditsError;

  if (isError) {
    return ( 
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500 text-2xl">😢 데이터를 불러오는 중 에러가 발생했습니다.</span>
      </div>
    );
  }
  
  return (
    <>
      <LoadingComponent isPending={isPending}>
        {details && credits && (
          <>
            <MovieInfo details={details} />
            <MovieCreditInfo casts={credits.cast} />
          </>
        )}
      </LoadingComponent>       
    </>
  )
}