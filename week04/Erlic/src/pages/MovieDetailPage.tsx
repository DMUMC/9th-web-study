import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import type { MovieDetails, Credits, CastMember } from "../types/credits";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const {
    data: details,
    loading: loadingDetails,
    error: detailsError,
  } = useCustomFetch<MovieDetails>(
    movieId ? `/movie/${movieId}` : null,
    {
      params: { language: "ko-kr" },
      enabled: Boolean(movieId),
      initialData: null,
    },
  );

  const {
    data: credits,
    loading: loadingCredits,
    error: creditsError,
  } = useCustomFetch<Credits>(
    movieId ? `/movie/${movieId}/credits` : null,
    {
      enabled: Boolean(movieId),
      initialData: null,
    },
  );

  const loading = loadingDetails || loadingCredits;
  const error = detailsError ?? creditsError;

  const director = useMemo(() => {
    return credits?.crew.find((m) => m.job === "Director");
  }, [credits]);

  const topCast: CastMember[] = useMemo(() => {
    return (credits?.cast ?? []).slice(0, 12);
  }, [credits]);

  if (loading) {
    return <div className="py-12"><Spinner /></div>;
  }

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!details) {
    return <ErrorBox message="영화 정보를 찾을 수 없어요." />;
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-indigo-50/80 via-white to-white shadow-xl">
        {details.backdrop_path && (
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <img
              src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
              alt={`${details.title} backdrop`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white/60 to-white" />
          </div>
        )}
        <div className="relative grid gap-8 p-8 md:grid-cols-[200px,1fr] md:p-10 lg:gap-10">
          <div className="w-full flex justify-center md:block">
            {details.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title}
                className="w-full max-w-[240px] rounded-2xl border border-slate-200 bg-white/60 shadow-lg ring-1 ring-black/5 md:w-auto"
              />
            ) : (
              <div className="grid aspect-[2/3] w-full max-w-[240px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-slate-400">
                이미지 없음
              </div>
            )}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">{details.title}</h1>
            {details.tagline && <p className="text-slate-600 italic">{details.tagline}</p>}
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                ⭐ {details.vote_average.toFixed(1)} <span className="text-slate-400">({details.vote_count.toLocaleString()})</span>
              </span>
              {details.release_date && <span>{details.release_date}</span>}
              {typeof details.runtime === "number" && <span>{details.runtime}분</span>}
              {details.genres?.length ? (
                <span>{details.genres.map(g => g.name).join(" • ")}</span>
              ) : null}
            </div>
            {details.overview && <p className="leading-relaxed text-slate-700">{details.overview}</p>}
            {director && (
              <p className="text-sm text-slate-600">
                감독: <span className="font-medium text-slate-800">{director.name}</span>
              </p>
            )}
            <div className="inline-flex flex-wrap gap-2 pt-2">
              {details.homepage && (
                <a
                  href={details.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                >
                  공식 사이트 방문
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">출연</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topCast.map((c) => (
            <div key={c.id} className="min-w-36 w-36">
              <div className="aspect-[2/3] overflow-hidden rounded-xl border border-slate-200">
                {c.profile_path ? (
                  <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w300${c.profile_path}`} alt={c.name} />
                ) : (
                  <div className="w-full h-full grid place-items-center text-slate-400 bg-slate-100">사진 없음</div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium leading-tight">{c.name}</p>
              <p className="text-xs text-slate-600">{c.character}</p>
            </div>
          ))}
          {!topCast.length && <p className="text-slate-500">출연진 정보가 없습니다.</p>}
        </div>
      </section>

      
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">제작진</h2>
        <div className="flex flex-wrap gap-3">
          {(credits?.crew ?? [])
            .filter((m) => ["Director","Producer","Screenplay","Writer","Original Music Composer"].includes(m.job))
            .slice(0, 10)
            .map((m) => (
            <div key={`${m.id}-${m.job}`} className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-slate-600">{m.job}</p>
            </div>
          ))}
          {(!credits?.crew?.length) && <p className="text-slate-500">제작진 정보가 없습니다.</p>}
        </div>
      </section>

      <div>
        <Link to={-1 as any} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← 뒤로
        </Link>
      </div>
    </div>
  );
}
