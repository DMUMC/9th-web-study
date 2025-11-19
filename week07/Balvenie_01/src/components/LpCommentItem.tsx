import { useState } from 'react';
import type { LpComment } from '../types/lp';
import useUpdateComment from '../hooks/mutations/useUpdateComment';
import useDeleteComment from '../hooks/mutations/useDeleteComment';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

interface CommentItemProps {
    comment: LpComment;
    lpId: string;
    formatDate: (date: string | Date) => string;
}

const CommentItem = ({ comment, lpId, formatDate }: CommentItemProps) => {
    const { data: myInfo } = useGetMyInfo();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

    // 현재 사용자가 댓글 작성자인지 확인
    const isMyComment = myInfo?.data?.id === comment.userId;

    const handleUpdate = () => {
        if (!editContent.trim() || isUpdating) return;
        updateComment(
            {
                lpId,
                commentId: comment.id,
                content: editContent.trim(),
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setShowMenu(false);
                },
                onError: (error) => {
                    console.error('댓글 수정 실패:', error);
                    alert('댓글 수정에 실패했습니다.');
                },
            }
        );
    };

    const handleDelete = () => {
        if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
        deleteComment(
            {
                lpId,
                commentId: comment.id,
            },
            {
                onSuccess: () => {
                    setShowMenu(false);
                },
                onError: (error) => {
                    console.error('댓글 삭제 실패:', error);
                    alert('댓글 삭제에 실패했습니다.');
                },
            }
        );
    };

    const userName = `사용자 #${comment.userId}`;
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex gap-3 rounded-lg border border-gray-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-medium text-white">
                {initials}
            </div>
            <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                        {userName}
                    </span>
                    <div className="relative flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                        </span>
                        {isMyComment && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="댓글 옵션"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 top-8 z-10 rounded-lg border border-gray-200 bg-white shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(true);
                                                setShowMenu(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            {isDeleting ? '삭제 중...' : '삭제'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                            rows={3}
                            disabled={isUpdating}
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={!editContent.trim() || isUpdating}
                                className="rounded-md bg-pink-500 px-4 py-1 text-sm text-white transition hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? '수정 중...' : '저장'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                                disabled={isUpdating}
                                className="rounded-md border border-gray-300 px-4 py-1 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-800">{comment.content}</p>
                )}
            </div>
        </div>
    );
};

export default CommentItem;