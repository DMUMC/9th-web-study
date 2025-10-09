import { useParams, useNavigate } from "react-router-dom";
import type { MovieResponseT, MovieT } from "../types/types";
import { MoivePoster } from "../components/MoivePoster";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useCustomFetch } from "../hooks/useCustomFetch";

const MoviePage = () => {
  const { category, page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page || "1");

  // 커스텀 훅을 사용하여 영화 데이터 가져오기
  const {
    data: movieResponse,
    loading,
    error,
    refetch,
  } = useCustomFetch<MovieResponseT>({
    url: `/movie/${category}`,
    params: {
      language: "ko-KR",
      page: page || "1",
    },
  });

  const movieList = movieResponse?.results || [];

  const handlePageChange = (page: number) => {
    navigate(`/movie/${category}/${page}`);
  };

  return (
    <>
      <Pagination currentPage={currentPage} onPageChange={handlePageChange} />

      {loading ? (
        <Loading message="영화 목록을 불러오는 중..." />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={refetch} />
      ) : (
        <div className="flex items-center justify-center pt-14">
          <div className="grid grid-cols-7 gap-8">
            {movieList.map((movie) => (
              <MoivePoster key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MoviePage;
