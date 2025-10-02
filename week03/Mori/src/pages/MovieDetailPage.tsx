import { useEffect, useState } from "react"
import { LoadingComponent } from "../components/LoadingComponent";
import { type MovieCredits, type MovieDetails } from "../types/movies";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MovieInfo } from "../components/MovieInfo";
import { MovieCreditInfo } from "../components/MovieCreditInfo";

export const MovieDetailPage = () => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const { movieId } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const { data } = await axios.get<MovieDetails>(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-UK`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          }},
      );
      setDetails(data);
    }
    const fetchMovieCredits = async () => {
      const { data } = await axios.get<MovieCredits>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          }},
      );
      setCredits(data);
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
        {details && credits && (
          <>
            <MovieInfo details={details} />
            <MovieCreditInfo credits={credits} />
          </>
        )}
      </LoadingComponent>      
    </>
  )
}
