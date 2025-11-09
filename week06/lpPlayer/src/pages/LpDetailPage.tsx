import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLpDetailQuery } from '../hooks/queries/useLpDetailQuery';
import { useAuth } from '../useAuth';
import { StateMessage } from '../components/StateMessage';
import { Modal } from '../components/Modal';
import { formatRelativeTime } from '../utils/date';

export const LpDetailPage = () => {
  const { lpId } = useParams();
  const numericId = Number(lpId);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [showGuard, setShowGuard] = useState(!isLoggedIn);

  useEffect(() => {
    setShowGuard(!isLoggedIn);
  }, [isLoggedIn]);

  const { data, isLoading, isError, refetch } = useLpDetailQuery(
    Number.isFinite(numericId) ? numericId : null,
  );

  const lp = useMemo(() => data?.data, [data]);
  const likesCount = lp?.likes?.length ?? 0;
  const relativeTime = lp ? formatRelativeTime(lp.createdAt) : '';
  const avatarInitial = lp?.author?.name?.[0] ?? 'U';

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  const handleBack = () => navigate(-1);

  if (!Number.isFinite(numericId)) {
    return (
      <StateMessage
        title="잘못된 LP 주소입니다"
        description="URL을 다시 확인한 뒤 시도해주세요."
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <button
        type="button"
        onClick={handleBack}
        className="text-left text-sm text-neutral-400 transition-colors hover:text-white"
      >
        ← 목록으로 돌아가기
      </button>

      {isLoading ? (
        <div className="space-y-6 rounded-[32px] border border-neutral-900 bg-neutral-950/50 p-8">
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-neutral-800" />
          <div className="h-5 w-1/2 animate-pulse rounded-full bg-neutral-800" />
          <div className="h-64 w-full animate-pulse rounded-[24px] bg-neutral-800" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-4 w-full animate-pulse rounded-full bg-neutral-800" />
            ))}
          </div>
        </div>
      ) : isError || !lp ? (
        <StateMessage
          title="LP 상세 정보를 불러오지 못했습니다"
          description="페이지를 새로고침하거나 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={refetch}
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-6 rounded-[32px] border border-neutral-900 bg-[#111218] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                  {avatarInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{lp.author?.name ?? '익명'}</p>
                  <p className="text-xs text-neutral-500">{relativeTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 transition-colors hover:border-neutral-700 hover:text-white"
                  aria-label="편집"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 transition-colors hover:border-neutral-700 hover:text-white"
                  aria-label="삭제"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M6 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path
                      d="M8 7v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">featured lp</p>
              <h1 className="text-4xl font-black text-white">{lp.title}</h1>
            </div>

            <div
              className="overflow-hidden rounded-[28px] border border-neutral-900 bg-black/30"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
            </div>

            <p className="text-base leading-relaxed text-neutral-200 whitespace-pre-line">{lp.content}</p>

            <div className="flex flex-wrap gap-2">
              {lp.tags?.length ? (
                lp.tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white">
                    #{tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-500">태그 없음</span>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff2b9c] px-6 py-2 text-sm font-semibold text-white shadow-[0_20px_35px_rgba(255,43,156,0.45)] transition-transform hover:scale-105"
              >
                <span>❤</span>
                좋아요 {likesCount}
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[{ label: '수정하기' }, { label: '삭제하기' }, { label: '좋아요' }].map((action) => (
              <button
                key={action.label}
                type="button"
                className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${
                  action.label === '좋아요'
                    ? 'border-transparent bg-[#ff2b9c] text-white hover:bg-[#ff4cad]'
                    : 'border-neutral-700 text-white hover:border-neutral-500'
                }`}
              >
                {action.label}
              </button>
            ))}
          </section>
        </div>
      )}

      {showGuard && (
        <Modal
          title="로그인이 필요합니다"
          description="상세 정보를 확인하려면 먼저 로그인해주세요."
          confirmLabel="로그인 하러가기"
          onConfirm={handleLoginRedirect}
        />
      )}
    </div>
  );
};
