import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { type MovieDetail, type CreditsResponse, type Cast, type Crew } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<CreditsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!movieId) return;

        const fetchMovieData = async () => {
            setIsLoading(true);
            setError(null);
            
            const options = {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    accept: 'application/json'
                }
            };

            try {
                const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
                const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

                const [movieRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(movieUrl, options),
                    axios.get<CreditsResponse>(creditsUrl, options)
                ]);

                setMovie(movieRes.data);
                setCredits(creditsRes.data);
            } catch (err) {
                console.error(err);
                setError("영화 정보를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <span className="text-red-500 text-2xl">{error}</span>
            </div>
        );
    }
    
    if (!movie || !credits) return null;

    const director = credits.crew.find((member: Crew) => member.job === "Director");
    const mainActors = credits.cast.slice(0, 12);

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="absolute top-0 left-0 w-full h-[60vh] opacity-30">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={`${movie.title} 배경`}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} 포스터`}
                        className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto md:mx-0"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-lg text-gray-400 italic mb-4">"{movie.tagline}"</p>
                        <div className="flex items-center gap-4 mb-4 text-lg">
                            <span className="text-yellow-400 font-bold">⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>|</span>
                            <span>{movie.release_date}</span>
                            <span>|</span>
                            <span>{movie.runtime}분</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">줄거리</h2>
                        <p className="text-gray-300 leading-relaxed max-w-2xl">{movie.overview}</p>
                    </div>
                </div>
                <div className="mt-16">
                     <h2 className="text-3xl font-bold mb-6">주요 출연진 및 제작진</h2>
                     {director && (
                         <div className="mb-8">
                             <h3 className="text-xl font-semibold">감독</h3>
                             <p className="text-gray-300">{director.name}</p>
                         </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {mainActors.map((actor: Cast) => (
                            <div key={actor.cast_id} className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-800">
                                    {actor.profile_path ? (
                                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                    )}
                                </div>
                                <p className="font-bold mt-2">{actor.name}</p>
                                <p className="text-sm text-gray-400">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};