import { useEffect, useState } from "react"
import { LoadingComponent } from "../components/LoadingComponent";
import { type CastMember, type MovieCredits, type MovieDetails } from "../types/movies";
import { apiClient } from '../util/AxiosInstance'
import { useParams } from "react-router-dom";
import { MovieInfo } from "../components/MovieInfo";
import { MovieCreditInfo } from "../components/MovieCreditInfo";

export const MovieDetailPage = () => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [casts, setCasts] = useState<CastMember[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const { movieId } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
     const { data } = await apiClient.get<MovieDetails>(`/movie/${movieId}?language=en-UK`);
      setDetails(data);
    }
    const fetchMovieCredits = async () => {
      const { data } = await apiClient.get<MovieCredits>(`/movie/${movieId}/credits?language=ko-KR`);
      setCasts(data.cast);
    }

    const fetchAllData = async () => {
      try {
        setIsPending(true);

        await Promise.all([
          fetchMovieDetails(),
          fetchMovieCredits(),
        ]);

      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchAllData();
  }, [movieId]);

  if (isError) {
    return ( 
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }
  
  return (
    <>
      <LoadingComponent isPending={isPending}>
        {details && casts && (
          <>
            <MovieInfo details={details} />
            <MovieCreditInfo casts={casts} />
          </>
        )}
      </LoadingComponent>      
    </>
  )
}
