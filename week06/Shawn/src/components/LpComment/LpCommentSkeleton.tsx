export const LpCommentSkeleton = () => {
    return (
        <div className='flex gap-2 items-center'>
            <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse'></div>
            <div className='gap-2 flex flex-col'>
                <div className='w-20 h-4 bg-gray-300 animate-pulse rounded-md'></div>
                <div className='w-64 h-4 bg-gray-300 animate-pulse rounded-md'></div>
            </div>
        </div>
    )
}