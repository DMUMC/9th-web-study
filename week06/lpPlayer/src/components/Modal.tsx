type ModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose?: () => void;
};

export const Modal = ({ title, description, confirmLabel, onConfirm, onClose }: ModalProps) => {
  const host = typeof window !== 'undefined' ? window.location.host : '서비스 안내';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#1c1f2c] bg-[#0f121b] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">{host} 안내</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{description}</p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#74d7e5] py-3 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#86e0ed]"
          >
            {confirmLabel}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-700 py-3 text-sm font-semibold text-white hover:border-neutral-500"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
