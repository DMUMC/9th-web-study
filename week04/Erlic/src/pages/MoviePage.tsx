import { useEffect, useState } from "react";
import type { Movie, MoviesResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

type Props = {
  category: "popular" | "upcoming" | "top_rated" | "now_playing";
};

const LABELS: Record<Props["category"], string> = {
  popular: "인기 영화",
  upcoming: "개봉 예정작",
  top_rated: "평점 높은 영화",
  now_playing: "현재 상영작",
};

export default function MoviePage({ category }: Props) {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useCustomFetch<MoviesResponse>(
    `/movie/${category}`,
    {
      params: { language: "ko-kr", page },
      dependencies: [page],
      initialData: null,
    },
  );

  const movies: Movie[] = data?.results ?? [];

  useEffect(() => {
    setPage(1);
  }, [category]);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6">
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-red-600 shadow-sm">
          <h2 className="text-xl font-semibold">영화를 불러오지 못했어요.</h2>
          <p className="mt-2 text-sm text-red-500">
            잠시 후 다시 시도해주세요. 문제가 계속되면 네트워크 연결을 확인해주세요.
          </p>
        </div>
      </section>
    );
  }

  if (!movies.length) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          {LABELS[category]} 정보를 찾을 수 없어요.
        </h2>
        <p className="text-slate-500">
          잠시 후 다시 시도하거나 다른 카테고리를 선택해보세요.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium uppercase tracking-wide text-slate-500 shadow-sm">
          {LABELS[category]}
        </span>
        <p className="text-sm text-slate-500">
          {LABELS[category]}를 모아봤어요. 마음에 드는 작품을 클릭해 자세한 정보를 확인해보세요.
        </p>
      </header>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
        >
          이전
        </button>
        <span className="inline-flex items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
          {page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          다음
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
