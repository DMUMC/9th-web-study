import { useState } from "react";
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

const CATEGORY_LABEL: Record<string, string> = {
  popular: '인기 작품',
  now_playing: '상영 중',
  top_rated: '평점 높은 작품',
  upcoming: '개봉 예정',
};

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  const token = import.meta.env.VITE_TMDB_KEY;
  const url = category
    ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
    : undefined;

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    url,
    [category, page],
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // 변수명 유지
  const movies: Movie[] = data?.results ?? [];
  const hero = movies[0];

  // 로딩 우선
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh gap-3">
        <LoadingSpinner />
        <p className="text-sm text-gray-300">영화 데이터를 불러오는 중이에요…</p>
      </div>
    );
  }

  // 로딩 종료 후에만 에러 노출
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10">
        <span className="text-red-500 text-xl font-semibold">
          영화를 불러오지 못했어요.
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-[#e50914] text-white shadow hover:brightness-110"
          onClick={() => location.reload()}
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] bg-black">
      {/* ===================== Hero Section (첫 줄 직전까지만 페이드) ===================== */}
      <section className="relative h-[22vw] max-h-[360px] min-h-[200px]">
        {/* 배경 이미지 */}
        {hero?.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* 좌측/상단 가독성 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />

        {/* ✅ 하단 페이드: 첫 번째 카드 라인 '직전'까지만 */}
        <div className="absolute inset-x-0 bottom-0 h-10 md:h-12 bg-gradient-to-b from-transparent to-black pointer-events-none" />

        {/* 콘텐츠 */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-6">
          <span className="inline-flex items-center text-[11px] tracking-wider rounded-full px-2 py-1 bg-white/10 text-[#e50914] border border-white/10 w-max">
            {CATEGORY_LABEL[category ?? 'popular'] ?? '영화'}
          </span>
          <h1 className="mt-2 text-2xl md:text-4xl font-extrabold text-white drop-shadow">
            {hero?.title ?? '지금 인기 있는 영화'}
          </h1>
          {hero?.overview && (
            <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-3">
              {hero.overview}
            </p>
          )}

          {/* 페이지 네비게이션 (변수명/로직 유지) */}
          <div className="mt-4 flex items-center gap-3">
            <button
              className="bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              이전
            </button>
            <button
              className="bg-[#e50914] text-white px-4 py-2 rounded-md hover:brightness-110 transition"
              onClick={() => setPage((prev) => prev + 1)}
            >
              다음
            </button>
            <span className="ml-3 text-sm text-gray-300">
              페이지 {page} / 카테고리: {category}
            </span>
          </div>
        </div>
      </section>

      {/* ===================== Cards Section (살짝만 겹치기) ===================== */}
      <section className="px-5 md:px-8 pb-14 -mt-4 md:-mt-5 relative z-20">
        {/* 보조 타이틀 라인 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">오늘의 추천</span>
          <div className="h-px flex-1 ml-3 bg-white/10" />
        </div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}