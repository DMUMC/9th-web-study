import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/utils";
import type { MovieDetailT } from "../types/types";
import { Loading } from "../components/Loading";
import { MovieDetailHeader } from "../components/MovieDetailHeader";
import { InfoCard } from "../components/InfoCard";
import type { CreditResponseT, CreditT } from "../types/types";
import { CreditProfile } from "../components/CreditProfile";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetailT | null>(null);
  const [creditCast, setCreditCast] = useState<CreditT[] | null>([]);
  const [creditCrew, setCreditCrew] = useState<CreditT[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovieDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<MovieDetailT>(
          `/movie/${movieId}?language=ko-KR`
        );
        setMovie(res.data);

        const creditRes = await api.get<CreditResponseT>(
          `/movie/${movieId}/credits?language=ko-KR`
        );
        setCreditCast(creditRes.data.cast);
        setCreditCrew(creditRes.data.crew);
      } catch (error) {
        console.error(error);
        setError("영화 상세정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    getMovieDetail();
  }, [movieId]);

  useEffect(() => {
    console.log(creditCast);
    console.log(creditCrew);
  }, [creditCast, creditCrew]);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center pt-14">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  if (!movie) return null;

  return (
    <div className="min-h-screen pt-10">
      <MovieDetailHeader movie={movie} />

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">줄거리</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>

        <div className="grid grid-cols-2 gap-6">
          <InfoCard label="상태" value={movie.status} />
          <InfoCard
            label="예산"
            value={
              movie.budget > 0
                ? `$${movie.budget.toLocaleString()}`
                : "정보 없음"
            }
          />
          <InfoCard
            label="수익"
            value={
              movie.revenue > 0
                ? `$${movie.revenue.toLocaleString()}`
                : "정보 없음"
            }
          />
          <InfoCard label="개봉일" value={movie.release_date} />
        </div>

        <div className="space-y-4 mt-10">
          <p className="text-lg font-bold">출연진</p>
          <div className="flex gap-5">
            {creditCast &&
              creditCast
                .slice(0, 10)
                .map((credit) => (
                  <CreditProfile
                    key={credit.id}
                    profile_path={credit.profile_path}
                    name={credit.name}
                    character={credit.character}
                    department={credit.department}
                  />
                ))}
          </div>
          <p className="text-lg font-bold">제작진</p>
          <div className="flex gap-5">
            {creditCrew &&
              creditCrew
                .slice(0, 10)
                .map((credit) => (
                  <CreditProfile
                    key={credit.id}
                    profile_path={credit.profile_path}
                    name={credit.name}
                    character={credit.character}
                    department={credit.department}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
