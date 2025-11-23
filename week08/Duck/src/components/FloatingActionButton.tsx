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
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-3xl font-bold text-white shadow-2xl transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:scale-110 hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-fade-in"
      aria-label="새 LP 작성"
    >
      {label}
    </button>
  );
};

export default FloatingActionButton;
