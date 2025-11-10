import type { LpComment } from '../types/lp';

type LpCommentItemProps = {
    comment: LpComment;
};

const LpCommentItem = ({ comment }: LpCommentItemProps) => {
    const createdAt = new Date(
        comment.createdAt
    ).toLocaleString('ko-KR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });

    return (
        <article className='flex gap-3 rounded-2xl border border-gray-700 bg-gray-900/60 p-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white'>
                {comment.author.name.charAt(0)}
            </div>
            <div className='flex-1'>
                <div className='flex items-center justify-between gap-2 text-xs text-gray-400'>
                    <span className='font-semibold text-gray-200'>
                        {comment.author.name}
                    </span>
                    <span>{createdAt}</span>
                </div>
                <p className='mt-2 text-sm leading-relaxed text-gray-200'>
                    {comment.content}
                </p>
            </div>
        </article>
    );
};

export default LpCommentItem;
