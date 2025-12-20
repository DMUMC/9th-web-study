type FloatingActionButtonProps = {
  onClick: () => void;
  label?: string;
};

const FloatingActionButton = ({
  onClick,
  label = "+",
}: FloatingActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-3xl font-bold text-white shadow-2xl transition-all hover:scale-110 hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/50 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-offset-2 active:scale-95"
      aria-label="새 LP 작성"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );
};

export default FloatingActionButton;
