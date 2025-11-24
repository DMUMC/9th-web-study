import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLpDetail, getLpComments, postComment, deleteComment, patchComment, postLike, deleteLike, deleteLp } from '../apis/lpApi';
import { ErrorDisplay, LpDetailSkeleton } from '../components/LoadingError';
import { CreateLpModal } from '../components/CreateLpModal';
import { useAuth } from '../context/AutoContext';
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
  const navigate = useNavigate();
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = lpid ? parseInt(lpid, 10) : undefined;
  
  const queryClient = useQueryClient();
  
  const { userEmail, userId } = useAuth(); 

  const [activeMenuCommentId, setActiveMenuCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const { mutate: deleteLpMutation } = useMutation({
    mutationFn: (id: number) => deleteLp(id),
    onSuccess: () => {
      alert('LP가 삭제되었습니다.');
      navigate('/lps');
    },
    onError: (err: any) => alert(err.response?.data?.message || '삭제 실패')
  });

  const isLikedByMe = lp?.likes?.some((l: any) => {
      return Number(l.userId) === Number(userId);
  });
  
  const likeCount = lp?.likeCount || (lp?.likes ? lp.likes.length : 0);

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => {
        if (isLikedByMe) {
            return deleteLike(numericLpId!);
        } else {
            return postLike(numericLpId!);
        }
    },
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['lp', numericLpId] });
      const previousLp = queryClient.getQueryData(['lp', numericLpId]);

      queryClient.setQueryData(['lp', numericLpId], (old: any) => {
         if (!old || (!old.data && !old.data?.data)) return old;
         const currentLp = old.data.data || old.data;
         
         let newLikes = [...(currentLp.likes || [])];
         let newCount = currentLp.likeCount || 0;

         if (isLikedByMe) {
             newLikes = newLikes.filter((l: any) => Number(l.userId) !== Number(userId));
             newCount = Math.max(0, newCount - 1);
         } else {
             newLikes.push({ userId: userId, id: 'temp-optimistic-id' });
             newCount += 1;
         }

         return {
             ...old,
             data: {
                 ...old.data,
                 data: { ...currentLp, likes: newLikes, likeCount: newCount }
             }
         };
      });
      return { previousLp };
    },
    onError: (err, _, context) => {
      console.error(err);
      queryClient.setQueryData(['lp', numericLpId], context?.previousLp);
      
      if ((err as any).response?.status === 409) {
          queryClient.invalidateQueries({ queryKey: ['lp', numericLpId] });
      } else {
          alert('좋아요 처리에 실패했습니다.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', numericLpId] });
    },
  });

  const [commentOrder, setCommentOrder] = useState<'desc' | 'asc'>('desc');
  const [commentInput, setCommentInput] = useState('');
  const observerRef = useRef<HTMLDivElement>(null);

  const { mutate: addCommentMutation } = useMutation({
    mutationFn: (content: string) => postComment(numericLpId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
      setCommentInput('');
    },
    onError: (err: any) => alert(err.response?.data?.message || '댓글 작성 실패')
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: (commentId: number) => deleteComment(numericLpId!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
      setActiveMenuCommentId(null);
    },
  });

  const { mutate: updateCommentMutation } = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => patchComment(numericLpId!, id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
      setEditingCommentId(null);
      setActiveMenuCommentId(null);
    },
  });

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setActiveMenuCommentId(null);
  };

  const getSafeComments = (pageData: any): Comment[] => {
      if (!pageData) return [];
      if (pageData.data && pageData.data.data && Array.isArray(pageData.data.data)) return pageData.data.data;
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
  if (isLpError) return <ErrorDisplay message="에러 발생" onRetry={refetchLp} />;
  if (!lp) return <ErrorDisplay message="LP 없음" />;

  const formattedDate = new Date(lp.createdAt).toLocaleDateString();
  const writerName = lp.author ? lp.author.name : (lp.authorId ? `작성자 #${lp.authorId}` : 'Unknown');
  const profileImageUrl = lp.author?.avatar || `https://placehold.co/40x40/555555/FFFFFF?text=${writerName[0] || 'U'}`;

  const getThumbnailUrl = (thumb: string) => {
      if (!thumb || !thumb.startsWith('http')) {
          return `https://picsum.photos/seed/${thumb || lp.id}/500/500`;
      }
      return thumb;
  };

  return (
    <article className="w-full max-w-2xl mx-auto p-6 bg-[#232323] rounded-xl shadow-2xl my-8 text-gray-200 font-sans min-h-screen">
       <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <img src={profileImageUrl} alt={writerName} className="w-10 h-10 rounded-full bg-neutral-600 object-cover" />
            <span className="font-semibold text-lg">{writerName}</span>
        </div>
        
        <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-400">{formattedDate}</span>
            {userEmail && lp.author?.email === userEmail && (
                <div className="flex gap-3">
                    <button onClick={() => setIsEditModalOpen(true)} className="text-sm text-gray-400 hover:text-white underline">수정</button>
                    <button onClick={() => { if(window.confirm('삭제하시겠습니까?')) deleteLpMutation(numericLpId!); }} className="text-sm text-red-400 hover:text-red-300 underline">삭제</button>
                </div>
            )}
        </div>
      </header>

      <h1 className="text-3xl font-bold mb-10 text-white">{lp.title}</h1>

      <div className="relative w-full max-w-md mx-auto aspect-square mb-10">
         <img src={getThumbnailUrl(lp.thumbnail)} alt={lp.title} className="w-full h-full object-cover rounded-full animate-[spin_10s_linear_infinite]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] bg-[#232323] rounded-full border-4 border-[#1a1a1a]"></div>
      </div>

      <p className="text-lg leading-relaxed mb-8 text-gray-300 whitespace-pre-line">{lp.content}</p>

      {lp.tags && lp.tags.length > 0 && (
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {lp.tags.map((tag: any, idx: number) => (
            <span key={idx} className="px-4 py-1.5 bg-[#3a3a3a] text-gray-300 rounded-full text-sm font-medium">
              #{tag.name || tag}
            </span>
          ))}
        </div>
      )}

      <footer className="flex justify-center items-center pb-8 border-b border-neutral-700 mb-8">
        <button 
            onClick={() => toggleLike()} 
            className="flex flex-col items-center gap-1 group p-2 transition-transform active:scale-90"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isLikedByMe ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                className={`w-10 h-10 ${isLikedByMe ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span className={`text-lg font-bold ${isLikedByMe ? "text-red-500" : "text-gray-400"}`}>
                {likeCount}
            </span>
        </button>
      </footer>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">댓글</h3>
          <div className="flex bg-neutral-800 rounded-lg p-1">
             <button onClick={() => setCommentOrder('desc')} className={`px-3 py-1 text-sm rounded-md ${commentOrder === 'desc' ? 'bg-neutral-600 text-white' : 'text-gray-400'}`}>최신순</button>
             <button onClick={() => setCommentOrder('asc')} className={`px-3 py-1 text-sm rounded-md ${commentOrder === 'asc' ? 'bg-neutral-600 text-white' : 'text-gray-400'}`}>오래된순</button>
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg mb-8">
          <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="댓글을 입력해주세요" className="w-full bg-neutral-900 text-white p-3 rounded-md border border-neutral-700 focus:border-blue-500 focus:outline-none resize-none h-24"/>
          <div className="flex justify-end mt-2">
            <button onClick={() => { if(!commentInput.trim()) return alert('내용을 입력해주세요'); addCommentMutation(commentInput); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-sm">작성</button>
          </div>
        </div>

        <div className="space-y-4">
          {!isCommentLoading && commentData?.pages.map((page, i) => {
             const comments = getSafeComments(page);
             return comments.map((comment) => (
               <div key={`${comment.id}-${i}`} className="flex gap-4 items-start border-b border-neutral-800 pb-4 last:border-0 group relative">
                 <img src={comment.author.avatar || `https://placehold.co/40x40/444444/FFFFFF?text=${comment.author.name?.[0] || 'U'}`} alt="profile" className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                 <div className="flex-1 w-full min-w-0">
                   <div className="flex justify-between items-start">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-gray-200">{comment.author.name}</span>
                         <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                       </div>
                       
                       {userEmail === comment.author.email && editingCommentId !== comment.id && (
                         <div className="relative">
                           <button onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-neutral-700">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                           </button>
                           {activeMenuCommentId === comment.id && (
                             <div className="absolute right-0 mt-2 w-24 bg-neutral-800 rounded-md shadow-lg border border-neutral-700 z-10 overflow-hidden">
                               <button onClick={() => handleStartEdit(comment)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700 hover:text-white">수정</button>
                               <button onClick={() => { if(window.confirm('삭제하시겠습니까?')) deleteCommentMutation(comment.id); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 hover:text-red-300">삭제</button>
                             </div>
                           )}
                         </div>
                       )}
                   </div>
                   {editingCommentId === comment.id ? (
                     <div className="mt-2">
                       <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-600 focus:border-blue-500 outline-none resize-none" rows={3}/>
                       <div className="flex justify-end gap-2 mt-2">
                         <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 text-sm text-gray-400 hover:text-white">취소</button>
                         <button onClick={() => updateCommentMutation({ id: comment.id, content: editContent })} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                       </div>
                     </div>
                   ) : (
                     <p className="text-gray-300 text-sm break-words">{comment.content}</p>
                   )}
                 </div>
               </div>
             ));
          })}
          {!isCommentLoading && <div ref={observerRef} className="h-5" />}
        </div>
      </section>

      {isEditModalOpen && lp && (
          <CreateLpModal 
            onClose={() => setIsEditModalOpen(false)}
            lpId={numericLpId}
            initialData={{
                title: lp.title,
                content: lp.content,
                thumbnail: lp.thumbnail,
                tags: lp.tags?.map((t: any) => t.name || t) || []
            }}
          />
      )}
    </article>
  );
};