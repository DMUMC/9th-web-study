import { useState, useEffect } from 'react';
import type { Comment } from '../../apis/comment';
import { formatDate } from '../../utils/date';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../apis/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment, deleteComment } from '../../apis/comment';
import ConfirmModal from '../Modal/ConfirmModal';
import { useModalStore } from '../../store/zustand/modalStore';

interface CommentItemProps {
  comment: Comment;
  lpId: number;
}

const CommentItem = ({ comment, lpId }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  useEffect(() => {
    if (isEditing) {
      setEditContent(comment.content);
    }
  }, [isEditing, comment.content]);
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
  });
  const { isOpen, open, close } = useModalStore();

  const isMyComment = currentUser?.id === comment.author.id;

  const updateMutation = useMutation({
    mutationFn: (content: string) => updateComment(lpId, comment.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(lpId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      close();
    },
  });

  const handleUpdate = () => {
    if (editContent.trim()) {
      updateMutation.mutate(editContent);
    }
  };

  const handleDelete = () => {
    open();
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isEditing) {
    return (
      <div className="flex gap-4 p-4 bg-gray-800 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          {comment.author.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.nickname}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-400">{comment.author.nickname[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-2 mb-2 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
            >
              확인
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          {comment.author.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.nickname}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-400">{comment.author.nickname[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{comment.author.nickname}</span>
              <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
            </div>
            {isMyComment && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpen}
        title="댓글 삭제"
        message="정말로 이 댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={close}
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
};

export default CommentItem;

