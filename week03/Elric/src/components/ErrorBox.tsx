export default function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-600/20 border border-red-500 text-red-200 rounded-md p-4 my-4">
      에러가 발생했어요: {message}
    </div>
  );
}
