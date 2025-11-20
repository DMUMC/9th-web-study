export const CommentSkeleton = () => (
  <div className="animate-pulse px-1 py-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-neutral-800" />
      <div className="flex-1 border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-neutral-800" />
            <div className="h-3 w-16 rounded-full bg-neutral-800" />
          </div>
          <div className="h-3 w-6 rounded-full bg-neutral-800" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded-full bg-neutral-800" />
          <div className="h-3 w-5/6 rounded-full bg-neutral-800" />
          <div className="h-3 w-4/6 rounded-full bg-neutral-800" />
        </div>
      </div>
    </div>
  </div>
);
