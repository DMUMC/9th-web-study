const LpCardSkeleton = () => {
    return (
        <div className='w-64 h-64 rounded-md p-1'>
            <div className='relative group hover:scale-105 transition-all duration-300 drop-shadow-lg w-full h-full'>
                <div className='animate-pulse bg-neutral-700 w-full h-full'></div>
            </div>
        </div>
    )
}

export default LpCardSkeleton