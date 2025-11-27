const LPDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-gray-700 rounded-lg" />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-8 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-700 rounded-full w-20" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPDetailSkeleton;

