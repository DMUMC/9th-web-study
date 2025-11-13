import type { CommentDto } from "../../types/lp"

interface LpCommentProps {
    comment: CommentDto
}

export const LpComment = ({comment}: LpCommentProps) => {
    return (
        <div className='flex gap-2 items-center'>
            <img src={comment.author.avatar ?? 'https://via.placeholder.com/150'} alt={comment.author.name ?? ''} className='w-10 h-10 rounded-full object-cover' />
            <div className='gap-2 flex flex-col'>
                <p className='text-sm font-bold'>{comment.author.name}</p>
                <p className='text-sm'>{comment.content}</p>
            </div>
        </div>
    )
}