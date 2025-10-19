interface LoadingProps {
  message?: string;
}

export const Loading = ({
  message = "데이터를 불러오는 중...",
}: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center pt-14 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};
