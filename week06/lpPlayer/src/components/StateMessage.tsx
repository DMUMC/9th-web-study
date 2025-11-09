type StateMessageProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const StateMessage = ({ title, description, actionLabel, onAction }: StateMessageProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/70 px-8 py-12 text-center">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    {description && <p className="mt-3 text-sm text-neutral-400">{description}</p>}
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
