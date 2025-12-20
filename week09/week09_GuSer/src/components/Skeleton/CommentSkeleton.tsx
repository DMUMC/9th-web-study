const CommentSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSkeleton;

