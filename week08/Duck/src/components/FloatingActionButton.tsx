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
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-2xl font-bold text-white shadow-2xl transition-all hover:from-pink-600 hover:to-purple-700 hover:scale-110 hover:shadow-pink-500/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
      aria-label="새 LP 작성"
    >
      <span className="transition-transform group-hover:rotate-90">
        {label}
      </span>
    </button>
  );
};

export default FloatingActionButton;
