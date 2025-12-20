type SkeletonCardProps = {
    variant?: 'lp' | 'comment';
    className?: string;
};

const SkeletonCard = ({
    variant = 'lp',
    className = '',
}: SkeletonCardProps) => {
    if (variant === 'comment') {
        return (
            <div
                className={`flex gap-3 rounded-2xl border border-gray-700 bg-gray-900/60 p-4 ${className}`}
            >
                <div className='h-10 w-10 animate-pulse rounded-full bg-gray-700' />
                <div className='flex-1 space-y-3'>
                    <div className='h-4 w-28 animate-pulse rounded bg-gray-700/90' />
                    <div className='h-3 w-full animate-pulse rounded bg-gray-700/70' />
                    <div className='h-3 w-3/4 animate-pulse rounded bg-gray-700/60' />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 ${className}`}
        >
            <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200' />
            <div className='absolute inset-0 flex flex-col justify-between p-3'>
                <div className='space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-gray-300/70' />
                    <div className='h-4 w-2/3 rounded bg-gray-300/60' />
                </div>
                <div className='flex items-center justify-between'>
                    <div className='h-3 w-16 rounded bg-gray-300/60' />
                    <div className='h-3 w-10 rounded bg-gray-300/50' />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;