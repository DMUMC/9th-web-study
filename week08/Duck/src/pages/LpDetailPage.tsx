import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetComments from "../hooks/queries/useGetComments";
import useCreateComment from "../hooks/mutations/useCreateComment";
import useDeleteLP from "../hooks/mutations/useDeleteLP";
import useToggleLike from "../hooks/mutations/useToggleLike";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import CommentItem from "../components/CommentItem";
import { getImageUrl } from "../utils/image";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { accessToken } = useAuth();
  const { data: myInfo } = useGetMyInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const [commentInput, setCommentInput] = useState("");
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");

  const { data, isPending, isError, refetch } = useGetLpDetail(lpId);
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useGetComments(lpId, commentOrder);

  // 디버깅: 댓글 데이터 확인
  console.log(
    "LpDetailPage - comments:",
    comments,
    "length:",
    comments?.length
  );
  const { mutate: createComment, isPending: isSubmitting } = useCreateComment();
  const { mutate: deleteLP, isPending: isDeletingLP } = useDeleteLP();
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleLike();

  const lp = useMemo(() => data?.data, [data]);

  // 현재 사용자가 게시글 작성자인지 확인
  const isAuthor = useMemo(() => {
    if (!lp || !myInfo?.data?.id) return false;
    return lp.authorId === myInfo.data.id;
  }, [lp, myInfo]);

  // 현재 사용자가 좋아요를 눌렀는지 확인
  const isLiked = useMemo(() => {
    if (!lp || !myInfo?.data?.id) return false;
    return lp.likes?.some((like) => like.userId === myInfo.data.id) ?? false;
  }, [lp, myInfo]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !lpId || isSubmitting) return;

    createComment(
      {
        lpId,
        content: commentInput.trim(),
      },
      {
        onSuccess: () => {
          setCommentInput("");
          // 댓글 목록 즉시 새로고침
          refetchComments();
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);
          alert("댓글 작성에 실패했습니다.");
        },
      }
    );
  };

  const handleDeleteLP = () => {
    if (!lpId || !confirm("정말 이 LP를 삭제하시겠습니까?")) return;
    deleteLP(lpId, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        console.error("LP 삭제 실패:", error);
        alert("LP 삭제에 실패했습니다.");
      },
    });
  };

  if (isPending) {
    return (
      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="space-y-4 rounded-xl bg-white p-6 text-center shadow">
        <p className="text-red-500">
          LP 정보를 불러오지 못했습니다. 다시 시도해주세요.
        </p>
        <button
          type="button"
          className="rounded-md bg-gray-900 px-4 py-2 text-white"
          onClick={() => refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
  }).format(new Date(lp.createdAt));

  const formatCommentDate = (date: string | Date) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  return (
    <article className="space-y-6 rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-xl border border-gray-100">
      <button
        type="button"
        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
        onClick={() => navigate(-1)}
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        뒤로가기
      </button>
      <header className="space-y-3 border-b border-gray-200 pb-6">
        <p className="text-sm font-medium text-gray-500">{formattedDate}</p>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {lp.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            작성자 #{lp.authorId}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-pink-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            좋아요 {lp.likes?.length ?? 0}
          </span>
          <span
            className={`rounded-full px-3 py-1 ${
              lp.published
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {lp.published ? "공개" : "비공개"}
          </span>
        </div>
        {lp.tags && lp.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-1 text-sm font-medium text-pink-700 transition-all hover:from-pink-200 hover:to-purple-200"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <figure className="flex justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 shadow-xl">
        {lp.thumbnail ? (
          <img
            src={getImageUrl(lp.thumbnail)}
            alt={`${lp.title} 앨범 이미지`}
            className="max-h-[70vh] w-full max-w-4xl object-contain"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center p-12">
            <svg
              className="h-full w-full max-w-md text-purple-400/80"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 코드 브래킷 배경 */}
              <path
                d="M40 60 L40 140 M160 60 L160 140"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* 코드 라인들 */}
              <line
                x1="60"
                y1="80"
                x2="140"
                y2="80"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="60"
                y1="100"
                x2="120"
                y2="100"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="60"
                y1="120"
                x2="140"
                y2="120"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.6"
              />
              {/* 중괄호 */}
              <path
                d="M50 70 Q45 85 50 100 Q45 115 50 130"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M150 70 Q155 85 150 100 Q155 115 150 130"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* 작은 코드 기호들 */}
              <circle
                cx="70"
                cy="100"
                r="2"
                fill="currentColor"
                opacity="0.8"
              />
              <circle
                cx="90"
                cy="100"
                r="2"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
          </div>
        )}
      </figure>

      <section className="whitespace-pre-line rounded-lg bg-gray-50 p-6 text-gray-800 leading-relaxed">
        {lp.content}
      </section>

      <div className="flex flex-wrap gap-3">
        {isAuthor && (
          <>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              onClick={() => navigate(`/lp/${lpId}/edit`)}
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDeleteLP}
              disabled={isDeletingLP}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              {isDeletingLP ? "삭제 중..." : "삭제"}
            </button>
          </>
        )}
        <button
          type="button"
          aria-pressed={isLiked}
          disabled={isTogglingLike || !accessToken}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            isLiked
              ? "bg-pink-600 text-white"
              : "bg-pink-500 text-white hover:bg-pink-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => {
            if (lpId) {
              toggleLike({ lpId, isLiked });
            }
          }}
        >
          {isTogglingLike ? (
            <span className="text-xs">처리 중...</span>
          ) : (
            <>
              {isLiked ? (
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              <span>{lp.likes?.length ?? 0}</span>
            </>
          )}
        </button>
      </div>

      <section className="border-t pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            댓글 ({comments.length})
          </h2>
          {comments.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommentOrder("desc")}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  commentOrder === "desc"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                최신순
              </button>
              <button
                type="button"
                onClick={() => setCommentOrder("asc")}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  commentOrder === "asc"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                오래된순
              </button>
            </div>
          )}
        </div>

        {accessToken ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-2">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력해주세요"
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows={3}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmitting}
                className="rounded-md bg-pink-500 px-6 py-2 text-white transition hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "작성 중..." : "작성"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              댓글을 작성하려면{" "}
              <button
                type="button"
                onClick={() => {
                  const redirect = encodeURIComponent(location.pathname);
                  navigate(`/login?redirect=${redirect}`);
                }}
                className="text-pink-500 hover:underline"
              >
                로그인
              </button>
              이 필요합니다.
            </p>
          </div>
        )}

        {isLoadingComments ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4"
              >
                <div className="h-4 w-1/4 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                lpId={lpId!}
                formatDate={formatCommentDate}
              />
            ))}
          </div>
        )}
      </section>
    </article>
  );
};

export default LpDetailPage;
