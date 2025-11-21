import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lpApi';
import { ErrorDisplay, LpDetailSkeleton } from '../components/LoadingError';
import type { Lp } from '../types/lp';

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const numericLpId = lpid ? parseInt(lpid, 10) : undefined;

  const { 
    data: responseData,
    isLoading, 
    isError, 
    error,
    refetch 
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

  if (isLoading) return <LpDetailSkeleton />;
  if (isError) return <ErrorDisplay message={error instanceof Error ? error.message : '알 수 없는 오류'} onRetry={refetch} />;
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
          <div className="flex gap-2">
            <button className="hover:text-white transition-colors" title="수정하기">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
            </button>
            <button className="hover:text-red-500 transition-colors" title="삭제하기">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <h1 className="text-3xl font-bold mb-10 text-white">{lp.title}</h1>

      <div className="relative w-full max-w-md mx-auto aspect-square mb-10">
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] animate-[spin_10s_linear_infinite] isolate">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] bg-[#232323] rounded-full border-4 border-[#1a1a1a]"></div>
        </div>
      </div>

      <p 
        className="text-lg leading-relaxed mb-8 text-gray-300"
        style={{ whiteSpace: 'pre-line' }} 
      >
        {lp.content}
      </p>

      {lp.tags && lp.tags.length > 0 && (
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {lp.tags.map((tag: any) => (
            <span key={tag.id} className="px-4 py-1.5 bg-[#3a3a3a] text-gray-300 rounded-full text-sm font-medium cursor-pointer hover:bg-[#444444] transition-colors">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <footer className="flex justify-center items-center">
        <button className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors group p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 group-hover:scale-110 transition-transform">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.99 0 3.923.986 5.25 2.616C14.327 3.986 16.26 3 18.25 3c3.036 0 5.5 2.322 5.5 5.25 0 3.924-2.438 7.11-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
          <span className="text-xl font-semibold">{likeCount}</span>
        </button>
      </footer>
    </article>
  );
};