import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLP, deleteLP, toggleLikeLP } from '../apis/lp';
import { formatDate } from '../utils/date';
import LPDetailSkeleton from '../components/Skeleton/LPDetailSkeleton';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import { isAuthenticated } from '../utils/token';
import { useQuery as useUserQuery } from '@tanstack/react-query';
import { getMe } from '../apis/auth';
import AuthRequiredModal from '../components/Modal/AuthRequiredModal';
import { useState } from 'react';
import ConfirmModal from '../components/Modal/ConfirmModal';
import { useModalStore } from '../store/zustand/modalStore';

const LPDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModalStore();
  const authenticated = isAuthenticated();

  const { data: currentUser } = useUserQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    enabled: authenticated,
  });

  const { data: lp, isLoading, isError } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLP(Number(lpId)),
    enabled: !!lpId,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeLP(Number(lpId)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });
      const previousLP = queryClient.getQueryData(['lp', lpId]);

      queryClient.setQueryData(['lp', lpId], (old: any) => ({
        ...old,
        isLiked: !old.isLiked,
        likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
      }));

      return { previousLP };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLP) {
        queryClient.setQueryData(['lp', lpId], context.previousLP);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLP(Number(lpId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/lps');
    },
  });

  const handleLike = () => {
    if (!authenticated) {
      setShowAuthModal(true);
      return;
    }
    likeMutation.mutate();
  };

  const handleDelete = () => {
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <LPDetailSkeleton />;
  }

  if (isError || !lp) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">LP를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  const isMyLP = currentUser?.id === lp.author.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={lp.imageUrl}
            alt={lp.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{lp.name}</h1>
            {isMyLP && (
              <div className="flex gap-2">
                <Link
                  to={`/edit-lp/${lp.id}`}
                  className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                  ✏️
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-400">작성자: {lp.author.nickname}</p>
          <p className="text-gray-400">{formatDate(lp.createdAt)}</p>

          <div className="flex flex-wrap gap-2">
            {lp.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-600/20 text-pink-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              lp.isLiked
                ? 'bg-pink-600 hover:bg-pink-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span>❤️</span>
            <span>{lp.likeCount}</span>
          </button>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">설명</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{lp.content}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8">
        <CommentList lpId={Number(lpId)} />
        {authenticated && (
          <div className="mt-8">
            <CommentForm lpId={Number(lpId)} />
          </div>
        )}
      </div>

      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="LP 삭제"
        message="정말로 이 LP를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
};

export default LPDetailPage;

