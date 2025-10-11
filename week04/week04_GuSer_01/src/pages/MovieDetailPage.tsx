import { Link, useParams } from 'react-router-dom';
import type { MovieDetails, Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';

const IMG = (path?: string | null, size: 'w500' | 'original' = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

type MovieWithCredits = MovieDetails & { credits: Credits };

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const token = import.meta.env.VITE_TMDB_KEY;

  const url = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&append_to_response=credits`
    : undefined;

  const {
    data: movieWithCredits,
    isPending,
    isError,
  } = useCustomFetch<MovieWithCredits>(url, [movieId], {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 변수명 유지
  const movie: MovieDetails | null = movieWithCredits ?? null;
  const credits: Credits | null = movieWithCredits?.credits ?? null;

  // ✅ 로딩 우선 + 초기 렌더 플리커 방지
  if (isPending || (!movieWithCredits && !isError)) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh gap-3">
        <LoadingSpinner />
        <p className="text-sm text-gray-300">영화 상세 정보를 불러오는 중이에요…</p>
      </div>
    );
  }

  // ✅ 진짜 에러일 때만 에러 UI 노출
  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-xl font-semibold">
          영화 정보를 불러오는데 실패했어요
        </p>
        <Link className="inline-block mt-4 underline text-[#e50914]" to="/">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // ✅ 최종 안전 가드 (TS 만족용 + 예외적 API 빈 응답 대비)
  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh gap-3">
        <LoadingSpinner />
        <p className="text-sm text-gray-300">영화 상세 데이터를 준비하고 있어요…</p>
      </div>
    );
  }

  const directors = (credits?.crew || []).filter((c) => c.job === 'Director');
  const topCast = (credits?.cast || [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 10);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={IMG(movie.poster_path, 'w500')}
          alt={movie.title}
          className="w-full md:w-80 rounded-xl shadow-lg"
        />
        <div className="flex-1">
          <span className="inline-block text-[11px] tracking-wider rounded-full px-2 py-1 bg-white/5 text-[#e50914] border border-white/10 mb-2">
            MOVIE DETAIL
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white">{movie.title}</h1>
          {movie.tagline && (
            <p className="mt-1 text-gray-300 italic">{movie.tagline}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-300">
            <span>평점 ⭐ {movie.vote_average.toFixed(1)}</span>
            <span>·</span>
            <span>상영시간 {movie.runtime}분</span>
            <span>·</span>
            <span>장르 {movie.genres.map((g) => g.name).join(', ') || '-'}</span>
          </div>

          {/* 설명 가독성 강화 */}
          <div className="mt-4">
            <div className="bg-black/50 rounded-xl p-4 shadow-inner ring-1 ring-white/10">
              <p className="text-white leading-relaxed">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>
          </div>

          {!!directors.length && (
            <p className="mt-3 text-gray-300">
              감독: {directors.map((d) => d.name).join(', ')}
            </p>
          )}
          <div className="mt-4">
            <Link to={-1 as unknown as string} className="underline text-[#e50914]">
              ← 뒤로가기
            </Link>
          </div>
        </div>
      </div>

      {/* 출연진 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-white">주요 출연</h2>
        {topCast.length ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {topCast.map((c) => (
              <li key={c.id} className="rounded-lg bg-white/5 p-3">
                {c.profile_path ? (
                  <img
                    src={IMG(c.profile_path, 'w500')}
                    alt={c.name}
                    className="w-full aspect-[2/3] object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-700 rounded-md mb-2" />
                )}
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-sm text-gray-400">{c.character}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">출연 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;