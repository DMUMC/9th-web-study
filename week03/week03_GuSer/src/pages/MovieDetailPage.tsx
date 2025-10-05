import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetails, Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

const IMG = (path?: string | null, size: 'w500' | 'original' = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

type MovieWithCredits = MovieDetails & { credits: Credits };

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchDetail = async () => {
      setIsPending(true);
      try {
        const token = import.meta.env.VITE_TMDB_KEY;

        // ✅ TMDB 문서: PATH=movie/{movie_id}, QUERY=language & append_to_response
        const { data } = await axios.get<MovieWithCredits>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&append_to_response=credits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMovie(data);
        setCredits(data.credits);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetail();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-xl font-semibold">
          영화 정보를 불러오는 중 문제가 발생했습니다.
        </p>
        <Link className="inline-block mt-4 underline text-[#b2dab1]" to="/">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const directors = (credits?.crew || []).filter(c => c.job === 'Director');
  const topCast = (credits?.cast || []).sort((a, b) => a.order - b.order).slice(0, 10);

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
          <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
          {movie.tagline && (
            <p className="mt-1 text-gray-400 italic">{movie.tagline}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-300">
            <span>평점 ⭐ {movie.vote_average.toFixed(1)}</span>
            <span>·</span>
            <span>상영시간 {movie.runtime}분</span>
            <span>·</span>
            <span>장르 {movie.genres.map(g => g.name).join(', ') || '-'}</span>
          </div>
          <p className="mt-4 text-gray-200 leading-relaxed">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
          {!!directors.length && (
            <p className="mt-3 text-gray-300">
              감독: {directors.map(d => d.name).join(', ')}
            </p>
          )}
          <div className="mt-4">
            <Link to={-1 as unknown as string} className="underline text-[#b2dab1]">
              ← 뒤로가기
            </Link>
          </div>
        </div>
      </div>

      {/* 출연진 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">주요 출연</h2>
        {topCast.length ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {topCast.map(c => (
              <li key={c.id} className="rounded-lg bg-black/30 p-3">
                {c.profile_path ? (
                  <img
                    src={IMG(c.profile_path, 'w500')}
                    alt={c.name}
                    className="w-full aspect-[2/3] object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-700 rounded-md mb-2" />
                )}
                <p className="font-medium">{c.name}</p>
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
