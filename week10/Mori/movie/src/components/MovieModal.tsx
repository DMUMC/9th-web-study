import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  if (!isOpen || !movie) return null;

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://parniangostar.com/_next/static/media/imgFallBack.581a9fe3.png";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleImdbSearch = () => {
    const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(imdbUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center"
          aria-label="닫기"
        >
          ×
        </button>

        <div className="p-6">
          {/* 제목 */}
          <div className="mb-6 text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              {movie.title}
            </h2>
            {movie.original_title !== movie.title && (
              <p className="text-lg text-gray-600">
                {movie.original_title}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 포스터 이미지 */}
            <div className="shrink-0">
              <img
                src={
                  movie.poster_path
                    ? `${imageBaseUrl}${movie.poster_path}`
                    : fallbackImage
                }
                alt={movie.title}
                className="w-full md:w-64 rounded-lg shadow-md"
              />
            </div>

            {/* 영화 정보 */}
            <div>
              {/* 평점 */}
              <div className="mb-4 text-left">
                <span className="text-2xl font-bold text-blue-600">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-600 ml-2">
                  ({movie.vote_count} 평가)
                </span>
              </div>

              {/* 개봉일 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">개봉일</h3>
                <p className="text-gray-600">{formatDate(movie.release_date)}</p>
              </div>

              {/* 인기도 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">인기도</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((movie.popularity / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* 줄거리 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">줄거리</h3>
                <p className="text-gray-600 leading-relaxed line-clamp-7">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={handleImdbSearch}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-semibold transition-colors"
                >
                  IMDb에서 검색하기
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;

