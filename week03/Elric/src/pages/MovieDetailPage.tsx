import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { MovieDetails, Credits, CastMember } from "../types/credits";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { tmdb } from "../api/tmdb";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);
        const [d, c] = await Promise.all([
          tmdb.get<MovieDetails>(`/movie/${movieId}`).then(r => r.data),
          tmdb.get<Credits>(`/movie/${movieId}/credits`).then(r => r.data),
        ]);
        if (aborted) return;
        setDetails(d);
        setCredits(c);
      } catch (e: any) {
        if (!aborted) setError(e?.message ?? "데이터를 불러오지 못했어요.");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    if (movieId) fetchAll();
    return () => { aborted = true; };
  }, [movieId]);

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
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[160px,1fr] gap-6">
          <div className="w-full flex justify-center md:block">
            {details.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title}
                className="rounded-xl border border-slate-200 w-full max-w-[200px] md:w-auto"
              />
            ) : (
              <div className="aspect-[2/3] w-full max-w-[200px] rounded-xl grid place-items-center border border-slate-200 text-slate-400">
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
          </div>
        </div>
      </section>

      {/* Cast */}
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

      {/* Crew (key roles) */}
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
