interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center pt-14 space-y-4">
      <div className="text-red-500 text-6xl">⚠️</div>
      <div className="text-red-500 text-lg text-center max-w-md">{error}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};
