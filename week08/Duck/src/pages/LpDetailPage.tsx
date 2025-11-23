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
    <article className="space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-purple-100 animate-fade-in">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors mb-4"
        onClick={() => navigate(-1)}
      >
        <svg
          className="w-5 h-5"
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
      <header className="space-y-3 border-b border-purple-100 pb-6">
        <p className="text-sm text-purple-600 font-medium">{formattedDate}</p>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {lp.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            작성자 #{lp.authorId}
          </span>
          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">
            ❤️ 좋아요 {lp.likes?.length ?? 0}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-medium ${
              lp.published
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {lp.published ? "공개" : "비공개"}
          </span>
        </div>
        {lp.tags && lp.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-1.5 text-sm font-medium border border-purple-200"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <figure className="flex justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg p-4">
        {lp.thumbnail ? (
          <img
            src={getImageUrl(lp.thumbnail)}
            alt={`${lp.title} 앨범 이미지`}
            className="max-h-[70vh] w-full max-w-4xl object-contain rounded-xl"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center text-purple-400 font-medium">
            썸네일 이미지가 없습니다.
          </div>
        )}
      </figure>

      <section className="whitespace-pre-line text-gray-700 leading-relaxed text-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        {lp.content}
      </section>

      <div className="flex flex-wrap gap-3">
        {isAuthor && (
          <>
            <button
              type="button"
              className="rounded-lg border-2 border-purple-300 px-5 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate(`/lp/${lpId}/edit`)}
            >
              ✏️ 수정
            </button>
            <button
              type="button"
              onClick={handleDeleteLP}
              disabled={isDeletingLP}
              className="rounded-lg border-2 border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isDeletingLP ? "삭제 중..." : "🗑️ 삭제"}
            </button>
          </>
        )}
        <button
          type="button"
          aria-pressed={isLiked}
          disabled={isTogglingLike || !accessToken}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isLiked
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
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

      <section className="border-t border-purple-100 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            💬 댓글 ({comments.length})
          </h2>
          {comments.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommentOrder("desc")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  commentOrder === "desc"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-purple-50 shadow-md hover:shadow-lg"
                }`}
              >
                최신순
              </button>
              <button
                type="button"
                onClick={() => setCommentOrder("asc")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  commentOrder === "asc"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-purple-50 shadow-md hover:shadow-lg"
                }`}
              >
                오래된순
              </button>
            </div>
          )}
        </div>

        {accessToken ? (
          <form
            onSubmit={handleSubmitComment}
            className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"
          >
            <div className="flex gap-3">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력해주세요..."
                className="flex-1 rounded-lg border-2 border-purple-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none"
                rows={3}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmitting}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-semibold transition-all duration-200 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isSubmitting ? "작성 중..." : "작성"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 text-center">
            <p className="text-sm text-gray-700">
              댓글을 작성하려면{" "}
              <button
                type="button"
                onClick={() => {
                  const redirect = encodeURIComponent(location.pathname);
                  navigate(`/login?redirect=${redirect}`);
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold underline transition-colors"
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
