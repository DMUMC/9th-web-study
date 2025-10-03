import { useEffect, useState } from "react";
import type { MovieResponseT, MovieT } from "../types/types";
import { api } from "../utils/utils";
import { MoivePoster } from "../components/MoivePoster";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";

const MoviePage = () => {
  const [movieList, setMovieList] = useState<MovieT[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { category, page } = useParams();
  const navigate = useNavigate();

  const currentPage = parseInt(page || "1");

  // 영화 목록 조회 API 호출
  useEffect(() => {
    const getMovieList = async () => {
      try {
        setIsLoading(true);
        setError(null); // 에러 상태 초기화
        const res = await api.get<MovieResponseT>(
          `/movie/${category}?language=ko-KR&page=${page}`
        );
        setMovieList(res.data.results);
      } catch (error) {
        console.error(error);
        setError("영화 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    getMovieList();
  }, [category, page]);

  useEffect(() => {
    console.log(movieList);
  }, [movieList]);

  const handlePageChange = (page: number) => {
    navigate(`/movie/${category}/${page}`);
  };

  return (
    <>
      <Pagination currentPage={currentPage} onPageChange={handlePageChange} />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="flex items-center justify-center pt-14">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-14">
          <div className="grid grid-cols-7 gap-8">
            {movieList?.map((movie) => (
              <MoivePoster key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MoviePage;
