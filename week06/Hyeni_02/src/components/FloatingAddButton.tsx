// src/components/FloatingAddButton.tsx
export const FloatingAddButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10
        w-14 h-14 bg-blue-600 text-white rounded-full
        flex items-center justify-center
        text-4xl font-light shadow-lg
        hover:bg-blue-700 transition-all
        transform hover:scale-110 z-20"
      title="새 LP 등록하기"
    >
      +
    </button>
  );
};