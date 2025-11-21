// src/components/LoadingError.tsx
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-12 h-12 border-4 border-t-blue-500 border-neutral-700 rounded-full animate-spin"></div>
  </div>
);

export const LpCardSkeleton = () => (
  <div className="w-full aspect-[4/5] bg-neutral-800 rounded-lg animate-pulse overflow-hidden">
    <div className="w-full aspect-square bg-neutral-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-neutral-700 rounded w-3/4"></div>
      <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
    </div>
  </div>
);

export const LpDetailSkeleton = () => (
  <div className="w-full max-w-3xl p-4 md:p-8 space-y-6 animate-pulse bg-neutral-800 rounded-lg my-8">
    <div className="flex justify-between items-center">
      <div className="h-8 bg-neutral-700 rounded w-1/2"></div>
      <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 bg-neutral-700 rounded w-16"></div>
      <div className="h-4 bg-neutral-700 rounded w-16"></div>
    </div>
    
    <div className="w-full aspect-square max-w-md mx-auto bg-neutral-700 rounded-lg"></div> {/* CD모양(rounded-full) 대신 일반 이미지(rounded-lg) */}

    <div className="space-y-3">
      <div className="h-4 bg-neutral-700 rounded w-full"></div>
      <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
    </div>

    <div className="flex justify-center pt-4 border-t border-neutral-700">
      <div className="h-8 bg-neutral-700 rounded w-20"></div>
    </div>
  </div>
);

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => (
  <div className="flex flex-col items-center justify-center p-10 bg-neutral-800 text-white rounded-lg shadow-lg w-full my-8">
    <p className="text-xl font-semibold text-red-400 mb-4">
      🚫 오류가 발생했습니다
    </p>
    <p className="text-gray-300 mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        다시 시도
      </button>
    )}
  </div>
);