import { useState, useEffect, useRef } from 'react';
import type { LpComment } from '../types/comment';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import useUpdateLpComment from '../hooks/mutations/useUpdateLpComment';
import useDeleteLpComment from '../hooks/mutations/useDeleteLpComment';

type LpCommentItemProps = {
    comment: LpComment;
};

const LpCommentItem = ({ comment }: LpCommentItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { data: myInfo } = useGetMyInfo();
    const updateCommentMutation = useUpdateLpComment();
    const deleteCommentMutation = useDeleteLpComment();

    const isMyComment = myInfo?.id === comment.authorId;

    // 메뉴 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const createdAt = new Date(
        comment.createdAt
    ).toLocaleString('ko-KR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });

    const handleUpdate = () => {
        if (!editContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        updateCommentMutation.mutate(
            {
                commentId: comment.id,
                lpId: comment.lpId,
                content: editContent,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setIsMenuOpen(false);
                },
                onError: (error) => {
                    console.error('댓글 수정 실패:', error);
                    alert('댓글 수정에 실패했습니다.');
                },
            }
        );
    };

    const handleDelete = () => {
        if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) {
            return;
        }

        deleteCommentMutation.mutate(
            {
                lpId: comment.lpId,
                commentId: comment.id,
            },
            {
                onSuccess: () => {
                    setIsMenuOpen(false);
                },
                onError: (error) => {
                    console.error('댓글 삭제 실패:', error);
                    alert('댓글 삭제에 실패했습니다.');
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
        setIsMenuOpen(false);
    };

    return (
        <article className='relative flex gap-3 rounded-2xl border border-gray-700 bg-gray-900/60 p-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white'>
                {comment.author.name.charAt(0)}
            </div>
            <div className='flex-1'>
                <div className='flex items-center justify-between gap-2 text-xs text-gray-400'>
                    <span className='font-semibold text-gray-200'>
                        {comment.author.name}
                    </span>
                    <div className='flex items-center gap-2'>
                    <span>{createdAt}</span>
                        {isMyComment && (
                            <div className='relative' ref={menuRef}>
                                <button
                                    type='button'
                                    onClick={() =>
                                        setIsMenuOpen(!isMenuOpen)
                                    }
                                    className='rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    aria-label='메뉴'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                                        />
                                    </svg>
                                </button>
                                {isMenuOpen && (
                                    <div className='absolute right-0 top-8 z-10 min-w-[80px] rounded-lg border border-gray-700 bg-gray-800 shadow-lg'>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setIsEditing(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className='block w-full whitespace-nowrap rounded-t-lg px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 focus:outline-none'
                                        >
                                            수정
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleDelete}
                                            disabled={
                                                deleteCommentMutation.isPending
                                            }
                                            className='block w-full whitespace-nowrap rounded-b-lg px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 focus:outline-none disabled:opacity-50'
                                        >
                                            {deleteCommentMutation.isPending
                                                ? '삭제 중...'
                                                : '삭제'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {isEditing ? (
                    <div className='mt-2 space-y-2'>
                        <textarea
                            value={editContent}
                            onChange={(event) =>
                                setEditContent(event.target.value)
                            }
                            className='w-full rounded-lg border border-gray-600 bg-[#1f1f25] px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                            rows={3}
                        />
                        <div className='flex gap-2'>
                            <button
                                type='button'
                                onClick={handleUpdate}
                                disabled={
                                    updateCommentMutation.isPending
                                }
                                className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                            >
                                {updateCommentMutation.isPending
                                    ? '수정 중...'
                                    : '수정'}
                            </button>
                            <button
                                type='button'
                                onClick={handleCancelEdit}
                                disabled={
                                    updateCommentMutation.isPending
                                }
                                className='rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50'
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : (
                <p className='mt-2 text-sm leading-relaxed text-gray-200'>
                    {comment.content}
                </p>
                )}
            </div>
        </article>
    );
};

export default LpCommentItem;
