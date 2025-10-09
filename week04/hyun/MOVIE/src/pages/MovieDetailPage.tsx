import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Cast, Crew, MovieDetail } from '../types/Movie';
import { useFetchMovieDetail } from '../hooks/useFetchMovieDetail';

export default function MovieDetailPage() {
    const { movieId } = useParams();
    const { movie, isPending, isError } = useFetchMovieDetail(movieId);

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <span className="text-red-500 text-2xl">
                영화 정보를 찾을 수 없습니다.
            </span>
        );
    }

    const director: Crew | undefined = movie.credits?.crew?.find(
        (c) => c.job === 'Director'
    );
    const mainCast: Cast[] = movie.credits?.cast?.slice(0, 10) || [];

    return (
        <div className="bg-black text-white min-h-screen">
            {/* 배경 이미지 섹션 */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={`${movie.title} 배경 이미지`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* 메인 정보 섹션 */}
            <div className="relative z-10 p-8 mt-[-100px] max-w-7xl mx-auto">
                {/* 제목 및 기본 정보 */}
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <ul className="flex gap-4 text-gray-400 mb-6 text-sm">
                    <li>{movie.release_date} 개봉</li>
                    {movie.runtime && <li>{movie.runtime}분</li>}
                    {movie.genres && movie.genres.length > 0 && (
                        <li>{movie.genres.map((g) => g.name).join(', ')}</li>
                    )}
                </ul>

                {/* 줄거리 */}
                <p className="text-gray-300 leading-relaxed mb-8 max-w-4xl">
                    {movie.overview}
                </p>

                {/* 감독/출연진 섹션 */}
                <h2 className="text-2xl font-bold mb-4">감독/출연</h2>
                <div className="flex overflow-x-auto gap-4 py-2 custom-scrollbar">
                    {/* 감독 정보 */}
                    {director && (
                        <div className="flex-shrink-0 flex flex-col items-center w-24">
                            <img
                                src={
                                    director.profile_path
                                        ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                                        : 'https://via.placeholder.com/200'
                                }
                                alt={director.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                            />
                            <p className="mt-2 text-sm text-center font-medium">
                                {director.name}
                            </p>
                            <p className="text-xs text-gray-400 text-center">
                                감독
                            </p>
                        </div>
                    )}

                    {/* 출연진 정보 */}
                    {mainCast.map((actor) => (
                        <div
                            key={actor.id}
                            className="flex-shrink-0 flex flex-col items-center w-24"
                        >
                            <img
                                src={
                                    actor.profile_path
                                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                        : 'https://via.placeholder.com/200'
                                }
                                alt={actor.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                            />
                            <p className="mt-2 text-sm text-center font-medium">
                                {actor.name}
                            </p>
                            <p className="text-xs text-gray-400 text-center line-clamp-2">
                                {actor.character}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
