import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  if (!isOpen || !movie) {
    return null;
  }

  const backdropBaseUrl = "https://image.tmdb.org/t/p/original";
  const fallbackImage = "https://placehold.co/1920x1080";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const handleIMDbSearch = () => {
    const searchQuery = encodeURIComponent(movie.title);
    window.open(`https://www.imdb.com/find?q=${searchQuery}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-all duration-200 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:scale-110"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 상단 배경 이미지 */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={
              movie.backdrop_path
                ? `${backdropBaseUrl}${movie.backdrop_path}`
                : fallbackImage
            }
            alt={`${movie.title} 배경`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        </div>

        {/* 모달 내용 */}
        <div className="p-6 md:p-8">
          {/* 제목 */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {movie.title}
          </h2>
          {movie.original_title !== movie.title && (
            <p className="text-gray-400 text-lg mb-6">{movie.original_title}</p>
          )}

          {/* 평점 및 개봉일 */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold text-white">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/90 text-sm">
                ({movie.vote_count} 평가)
              </span>
            </div>
            {movie.release_date && (
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-400 mr-2 text-sm">📅 개봉일</span>
                <span className="text-white font-medium">
                  {formatDate(movie.release_date)}
                </span>
              </div>
            )}
          </div>

          {/* 인기도 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">인기도</span>
              <span className="text-white">{movie.popularity.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${Math.min((movie.popularity / 100) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* 줄거리 */}
          {movie.overview && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">줄거리</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {/* 버튼들 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleIMDbSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🔍 IMDb에서 검색
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
