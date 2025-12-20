import { Check, EllipsisVertical, Pencil, Trash, X } from 'lucide-react'
import type { CommentDto } from '../../types/lp'
import useGetMyInfo from '../../hooks/queries/useGetMyInfo'
import { useState } from 'react'
import useDeleteLpComment from '../../hooks/mutation/LpComment/useDeleteLpComment'
import useUpdateLpComment from '../../hooks/mutation/LpComment/useUpdateLpComment'

interface LpCommentProps {
	comment: CommentDto
}

export const LpComment = ({ comment }: LpCommentProps) => {
	const { data } = useGetMyInfo()
	const isMyComment = data?.data.id === comment.author.id
	const [toggleMenu, setToggleMenu] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [commentContent, setCommentContent] = useState(comment.content)
    const updateLpCommentMutation = useUpdateLpComment()
    const deleteLpCommentMutation = useDeleteLpComment()

    const handleMenuOpen = () => {
        setToggleMenu(false)
        setIsEditMode(true)
    }

    const handleUpdateLpComment = () => {
        updateLpCommentMutation.mutate({
            lpid: comment.lpId,
            commentId: comment.id,
            commentData: commentContent,
        })
    }

    const handleDeleteLpComment = () => {
        deleteLpCommentMutation.mutate({
            lpid: comment.lpId,
            commentId: comment.id,
        })
    }

	return (
		<div className='flex gap-2 items-center'>
			<img src={comment.author.avatar ?? 'https://via.placeholder.com/150'} alt={comment.author.name ?? ''} className='w-10 h-10 rounded-full object-cover' />
			<div className='gap-2 flex flex-col w-full'>
				<p className='text-sm font-bold'>{comment.author.name}</p>
                {/* 수정모드일 때 입력창 표시 */}
                {isEditMode ? (
                    <input type='text' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className='w-full p-2 rounded-md border-2 border-gray-300' />
                ) : (
                    <p className='text-sm'>{comment.content}</p>
                )}
			</div>

            {/* 작성자가 본인이면 메뉴 버튼 표시 */}
			{ isEditMode ? (
                <div className='flex gap-2 items-center justify-center'>
                    <Check  className='w-6 h-6 cursor-pointer' onClick={handleUpdateLpComment} />
                    <X className='w-6 h-6 cursor-pointer' onClick={handleDeleteLpComment} />
                </div>
            ) : ( isMyComment && (
				<div className='relative ml-auto'>
					<EllipsisVertical className='w-4 h-4 cursor-pointer' onClick={() => setToggleMenu(!toggleMenu)} />
					{toggleMenu && (
						<div className='absolute left-0 top-6 rounded-md flex items-center justify-center gap-3 z-10 shadow-lg min-w-[80px] bg-neutral-700 p-2'>
							<Pencil className='w-6 h-6 cursor-pointer' onClick={handleMenuOpen} />
							<Trash className='w-6 h-6 cursor-pointer' />
						</div>
					)}
				</div>
			))}
		</div>
	)
}