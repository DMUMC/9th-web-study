import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';
import type { Movie } from '../components/MovieCard';
import { MovieCard } from '../components/MovieCard';

const LANGUAGE_OPTIONS = [
    { label: '한국어 (ko-KR)', value: 'ko-KR' },
    { label: '영어 (en-US)', value: 'en-US' },
    { label: '일본어 (ja-JP)', value: 'ja-JP' },
];

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

type SearchResponse = {
    results?: Array<{
        id: number;
        title: string;
        original_title?: string;
        overview: string;
        release_date?: string;
        poster_path?: string | null;
        backdrop_path?: string | null;
        vote_average?: number;
        original_language?: string;
        popularity?: number;
        vote_count?: number;
    }>;
};

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [includeAdult, setIncludeAdult] = useState(false);
    const [language, setLanguage] = useState<string>(LANGUAGE_OPTIONS[0].value);
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Movie | null>(null);

    const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

    const handleAdultChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setIncludeAdult(event.target.checked);
    }, []);

    const handleLanguageChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    }, []);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedQuery = query.trim();

            if (!trimmedQuery) {
                setError('영화 제목을 입력해주세요.');
                setResults([]);
                return;
            }

            const apiKey = import.meta.env.VITE_TMDB_API_KEY;
            if (!apiKey) {
                setError('VITE_TMDB_API_KEY를 .env에 설정해주세요.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // TMDB는 v3 키(api_key 쿼리)와 v4 토큰(Bearer 헤더) 방식이 다르므로 둘 다 지원
                const isV4Token = apiKey.startsWith('eyJ'); // v4 토큰은 JWT 형태로 시작

                const searchOnce = async (term: string) => {
                    const url = new URL(TMDB_SEARCH_URL);
                    url.searchParams.set('query', term);
                    url.searchParams.set('language', language);
                    url.searchParams.set('include_adult', String(includeAdult));
                    if (!isV4Token) {
                        url.searchParams.set('api_key', apiKey);
                    }

                    const response = await fetch(
                        url.toString(),
                        isV4Token
                            ? {
                                  headers: {
                                      Authorization: `Bearer ${apiKey}`,
                                  },
                              }
                            : undefined
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch movies');
                    }

                    const data: SearchResponse = await response.json();
                    return (
                        data.results?.map((item) => ({
                            id: item.id,
                            title: item.title,
                            original_title: item.original_title,
                            overview: item.overview,
                            release_date: item.release_date,
                            poster_path: item.poster_path,
                            backdrop_path: item.backdrop_path,
                            vote_average: item.vote_average,
                            original_language: item.original_language,
                            popularity: item.popularity,
                            vote_count: item.vote_count,
                        })) ?? []
                    );
                };

                const noSpaceQuery = trimmedQuery.replace(/\s+/g, '');
                const spacedPerChar =
                    !trimmedQuery.includes(' ') && trimmedQuery.length > 2
                        ? trimmedQuery.split('').join(' ')
                        : '';

                // 공백이 없는 단어라면, 한 곳씩만 공백을 삽입한 후보를 만들어본다 (예: "너의이름은" -> "너의 이름은")
                const splitCandidates: string[] = [];
                if (!trimmedQuery.includes(' ') && noSpaceQuery.length > 3) {
                    const limit = Math.min(noSpaceQuery.length - 1, 6); // 요청 남발 방지
                    for (let i = 1; i <= limit; i += 1) {
                        const candidate = `${noSpaceQuery.slice(0, i)} ${noSpaceQuery.slice(i)}`;
                        splitCandidates.push(candidate);
                    }
                }

                // 우선순위: 원본 → 공백 제거 → 문자 사이 공백 삽입 → 단일 공백 삽입 후보들
                const ordered = [trimmedQuery, noSpaceQuery, spacedPerChar, ...splitCandidates];
                const candidates = ordered.filter((v): v is string => Boolean(v));
                const uniqCandidates = candidates.filter((v, idx) => candidates.indexOf(v) === idx);

                let movies: Movie[] = [];
                for (const term of uniqCandidates) {
                    movies = await searchOnce(term);
                    if (movies.length) break;
                }

                setResults(movies);
            } catch (err) {
                console.error(err);
                setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        },
        [includeAdult, language, query]
    );

    // 평점이 높은 순으로 정렬한 결과를 메모이제이션해, 동일한 결과 배열일 때는 재계산을 건너뛴다.
    const sortedResults = useMemo(
        () => [...results].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)),
        [results]
    );

    const resultSummary = useMemo(() => {
        if (!sortedResults.length) return '검색 결과가 여기에 표시됩니다.';
        return `${sortedResults.length}편의 영화를 평점 순으로 표시 중`;
    }, [sortedResults]);

    const handleSelect = useCallback((movie: Movie) => {
        setSelected(movie);
    }, []);

    const handleClose = useCallback(() => {
        setSelected(null);
    }, []);

    const imdbUrl = useMemo(() => {
        if (!selected) return '#';
        const query =
            selected.title?.trim() ||
            selected.original_title?.trim() ||
            '';
        if (!query) return '#';
        return `https://www.imdb.com/find?q=${encodeURIComponent(query.replace(/\s+/g, ' '))}`;
    }, [selected]);

    const backdropUrl = useMemo(() => {
        if (!selected?.backdrop_path) return null;
        return `https://image.tmdb.org/t/p/w780${selected.backdrop_path}`;
    }, [selected]);

    return (
        <div className='mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10'>
            <header className='space-y-2'>
                <p className='text-sm font-semibold text-indigo-600'>React useCallback · useMemo · memo</p>
                <h1 className='text-4xl font-bold tracking-tight text-slate-900'>최적화된 영화 검색</h1>
                
            </header>

            <form
                className='space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg'
                onSubmit={handleSubmit}
            >
                <div className='flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-700'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg'>🎬</span>
                        <span>영화 제목</span>
                    </div>
                    <div className='flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600'>
                        <span className='flex items-center gap-1'>⚙️ 옵션</span>
                        <label className='flex items-center gap-2 text-sm'>
                            <input
                                checked={includeAdult}
                                className='h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                                onChange={handleAdultChange}
                                type='checkbox'
                            />
                            성인 콘텐츠 포함
                        </label>
                    </div>
                </div>

                <div className='grid gap-3 md:grid-cols-[1fr_auto] md:items-center'>
                    <input
                        className='w-full rounded-xl border border-slate-200 px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                        onChange={handleQueryChange}
                        placeholder='영화 제목을 입력하세요'
                        type='text'
                        value={query}
                    />
                    <button
                        className='inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300'
                        disabled={loading}
                        type='submit'
                    >
                        {loading ? '검색 중...' : '🔍 검색하기'}
                    </button>
                </div>

                <div className='grid gap-3 md:grid-cols-[1fr_auto] md:items-center'>
                    <select
                        className='w-full rounded-xl border border-slate-200 px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                        onChange={handleLanguageChange}
                        value={language}
                    >
                        {LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className='text-sm font-medium text-slate-700'>언어</span>
                </div>
            </form>

            <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-slate-900'>검색 결과</h2>
                    <p className='text-sm text-slate-500'>{resultSummary}</p>
                </div>

                {error && (
                    <div className='rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm'>
                        {error}
                    </div>
                )}

                <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {sortedResults.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onSelect={handleSelect} />
                    ))}
                    {!sortedResults.length && !loading && !error && (
                        <div className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm'>
                            검색어를 입력하고 영화 목록을 불러와 보세요.
                        </div>
                    )}
                </div>
            </section>

            {selected && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8 backdrop-blur-sm'>
                    <div className='w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] ring-1 ring-slate-200/80 max-h-[90vh]'>
                        <div className='relative h-56 w-full overflow-hidden bg-slate-900'>
                            {backdropUrl && (
                                <img
                                    alt={selected.title}
                                    className='h-full w-full object-cover opacity-90'
                                    src={backdropUrl}
                                />
                            )}
                            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30' />
                            <button
                                aria-label='닫기'
                                className='absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white text-xl transition hover:bg-black/90'
                                onClick={handleClose}
                                type='button'
                            >
                                ×
                            </button>
                            <div className='absolute bottom-4 left-6 flex flex-col gap-1'>
                                <h3 className='text-2xl font-bold text-white drop-shadow'>{selected.title}</h3>
                                {selected.original_title && (
                                    <p className='text-sm text-slate-100 drop-shadow'>{selected.original_title}</p>
                                )}
                            </div>
                        </div>

                        <div className='max-h-[58vh] overflow-y-auto px-8 py-7'>
                            <div className='flex flex-col gap-8 md:flex-row md:items-start md:gap-10'>
                                <div className='w-60 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-lg ring-1 ring-slate-200 mx-auto md:mx-0'>
                                    {selected.poster_path ? (
                                        <img
                                            alt={selected.title}
                                            className='w-full object-cover'
                                            src={`https://image.tmdb.org/t/p/w300${selected.poster_path}`}
                                        />
                                    ) : (
                                        <div className='flex aspect-[2/3] items-center justify-center text-sm text-slate-400'>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className='flex flex-1 flex-col gap-4'>
                                    <div className='flex flex-wrap items-center gap-3 text-sm'>
                                        {typeof selected.vote_average === 'number' && (
                                            <span className='text-xl font-bold text-indigo-600'>
                                                {selected.vote_average.toFixed(1)}
                                            </span>
                                        )}
                                        {typeof selected.vote_count === 'number' && (
                                            <span className='text-slate-500'>({selected.vote_count} 평가)</span>
                                        )}
                                        {selected.popularity && (
                                            <span className='text-slate-500'>· 인기 {selected.popularity.toFixed(0)}</span>
                                        )}
                                    </div>

                                    <div className='grid gap-2 text-sm text-slate-700 md:grid-cols-2 md:gap-3'>
                                        <div className='flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5'>
                                            <span className='font-semibold text-slate-800'>개봉일</span>
                                            <span>{selected.release_date || '-'}</span>
                                        </div>
                                        <div className='flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5'>
                                            <span className='font-semibold text-slate-800'>언어</span>
                                            <span>{selected.original_language || '-'}</span>
                                        </div>
                                    </div>

                                    <div className='h-1 rounded-full bg-slate-100'>
                                        <div
                                            className='h-1 rounded-full bg-indigo-500 transition'
                                            style={{
                                                width: `${
                                                    Math.min(Math.max((selected.vote_average ?? 0) * 10, 0), 100)
                                                }%`,
                                            }}
                                        />
                                    </div>

                                    <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-inner'>
                                        {selected.overview || '줄거리가 제공되지 않습니다.'}
                                    </div>

                                    <div className='flex flex-wrap gap-3 pt-2'>
                                        <a
                                            className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            href={imdbUrl}
                                            rel='noreferrer'
                                            target='_blank'
                                        >
                                            IMDb에서 검색
                                        </a>
                                        <button
                                            className='inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
                                            onClick={handleClose}
                                            type='button'
                                        >
                                            닫기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
