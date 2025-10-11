export const LoadingSpinner = () => {
  return (
    <div
      className="size-12 animate-spin rounded-full border-[6px] border-t-transparent border-[#e50914]"
      role="status"
    >
      <span className="sr-only">로딩 중..</span>
    </div>
  );
};