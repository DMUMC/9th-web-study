import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getLpDetail, getLpComments } from '../apis/lpApi';
import { ErrorDisplay, LpDetailSkeleton, CommentSkeleton } from '../components/LoadingError';
import type { Lp } from '../types/lp';

interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
  };
}

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = lpid ? parseInt(lpid, 10) : undefined;

  const { 
    data: responseData,
    isLoading: isLpLoading, 
    isError: isLpError, 
    error: lpError,
    refetch: refetchLp 
  } = useQuery({
    queryKey: ['lp', numericLpId], 
    queryFn: () => getLpDetail(numericLpId!),
    enabled: !!numericLpId,
  });

  const getSafeLp = (data: any): Lp | null => {
    if (!data) return null;
    if (data.data && (data.data.title || data.data.id)) return data.data as Lp;
    if (data.title || data.id) return data as Lp;
    if (data.data && data.data.data) return data.data.data as Lp;
    return null;
  };

  const lp = getSafeLp(responseData);

  const [commentOrder, setCommentOrder] = useState<'desc' | 'asc'>('desc');
  const observerRef = useRef<HTMLDivElement>(null);

  const getSafeComments = (pageData: any): Comment[] => {
    if (!pageData) return [];
    
    if (pageData.data && pageData.data.data && Array.isArray(pageData.data.data)) {
      return pageData.data.data;
    }
    if (pageData.data && Array.isArray(pageData.data)) return pageData.data;
    if (Array.isArray(pageData)) return pageData;
    
    return [];
  };

  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentLoading,
  } = useInfiniteQuery({
    queryKey: ['lpComments', numericLpId, commentOrder],
    queryFn: ({ pageParam }) => getLpComments(numericLpId!, {
      order: commentOrder,
      cursor: pageParam as number | undefined,
      limit: 10
    }),
    initialPageParam: undefined,
    enabled: !!numericLpId,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.data?.nextCursor) return lastPage.data.nextCursor;
      if (lastPage.nextCursor) return lastPage.nextCursor;
      
      const items = getSafeComments(lastPage);
      if (items.length > 0) return items[items.length - 1].id;
      return undefined;
    },
  });

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);



  if (isLpLoading) return <LpDetailSkeleton />;
  if (isLpError) return <ErrorDisplay message={lpError instanceof Error ? lpError.message : '알 수 없는 오류'} onRetry={refetchLp} />;
  if (!lp) return <ErrorDisplay message="LP 정보를 찾을 수 없습니다." />;

  const formattedDate = new Date(lp.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const writerName = lp.authorId ? `작성자 #${lp.authorId}` : 'Unknown';
  const profileImageUrl = `https://placehold.co/40x40/555555/FFFFFF?text=${writerName[0]}`;
  const likeCount = Array.isArray(lp.likes) ? lp.likes.length : (lp.likeCount || 0);

  return (
    <article className="w-full max-w-2xl mx-auto p-6 bg-[#232323] rounded-xl shadow-2xl my-8 text-gray-200 font-sans">
      
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={profileImageUrl} alt={writerName} className="w-10 h-10 rounded-full bg-neutral-600" />
          <span className="font-semibold text-lg">{writerName}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span className="text-sm">{formattedDate}</span>
        </div>
      </header>

      <h1 className="text-3xl font-bold mb-10 text-white">{lp.title}</h1>

      <div className="relative w-full max-w-md mx-auto aspect-square mb-10">
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] animate-[spin_10s_linear_infinite] isolate">
          <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] bg-[#232323] rounded-full border-4 border-[#1a1a1a]"></div>
        </div>
      </div>

      <p className="text-lg leading-relaxed mb-8 text-gray-300" style={{ whiteSpace: 'pre-line' }}>
        {lp.content}
      </p>

      {lp.tags && lp.tags.length > 0 && (
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {lp.tags.map((tag: any) => (
            <span key={tag.id} className="px-4 py-1.5 bg-[#3a3a3a] text-gray-300 rounded-full text-sm font-medium">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <footer className="flex justify-center items-center pb-8 border-b border-neutral-700 mb-8">
        <button className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors group p-2">
            <span className="text-2xl">❤️</span>
            <span className="text-xl font-semibold">{likeCount}</span>
        </button>
      </footer>


      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">댓글</h3>
          
          <div className="flex bg-neutral-800 rounded-lg p-1">
             <button 
               onClick={() => setCommentOrder('desc')}
               className={`px-3 py-1 text-sm rounded-md transition-colors ${commentOrder === 'desc' ? 'bg-neutral-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
             >
               최신순
             </button>
             <button 
               onClick={() => setCommentOrder('asc')}
               className={`px-3 py-1 text-sm rounded-md transition-colors ${commentOrder === 'asc' ? 'bg-neutral-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
             >
               오래된순
             </button>
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg mb-8">
          <textarea 
            placeholder="댓글을 입력해주세요" 
            className="w-full bg-neutral-900 text-white p-3 rounded-md border border-neutral-700 focus:border-blue-500 focus:outline-none resize-none h-24"
          />
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-sm transition-colors">
              작성
            </button>
          </div>
        </div>

        <div className="space-y-4">
          
          {isCommentLoading && (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          )}

          {!isCommentLoading && commentData?.pages.map((page, i) => {
             const comments = getSafeComments(page);
             return comments.map((comment) => (
               <div key={`${comment.id}-${i}`} className="flex gap-4 items-start border-b border-neutral-800 pb-4 last:border-0">
                 <img 
                   src={comment.author.avatar || `https://placehold.co/40x40/444444/FFFFFF?text=${comment.author.name?.[0] || 'U'}`} 
                   alt="profile" 
                   className="w-10 h-10 rounded-full bg-neutral-700 object-cover"
                 />
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold text-gray-200">{comment.author.name}</span>
                     <span className="text-xs text-gray-500">
                       {new Date(comment.createdAt).toLocaleDateString()}
                     </span>
                   </div>
                   <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                 </div>
               </div>
             ));
          })}

          {!isCommentLoading && commentData?.pages[0] && getSafeComments(commentData.pages[0]).length === 0 && (
            <p className="text-center text-gray-500 py-4">아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          )}

          {isFetchingNextPage && (
            <>
               <CommentSkeleton />
               <CommentSkeleton />
            </>
          )}

          {!isCommentLoading && <div ref={observerRef} className="h-5" />}
        </div>
      </section>
    </article>
  );
};