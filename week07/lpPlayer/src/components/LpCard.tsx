import type { LpDto } from '../types/lp';
import { formatRelativeTime } from '../utils/date';

type LpCardProps = {
  lp: LpDto;
  onClick: () => void;
};

export const LpCard = ({ lp, onClick }: LpCardProps) => {
  const likesCount = lp.likes?.length ?? 0;
  const relativeTime = formatRelativeTime(lp.createdAt);

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-900/40 shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="space-y-1 px-4 pb-5">
          <p className="text-sm font-semibold text-white">{lp.title}</p>
          <div className="flex items-center justify-between text-xs text-neutral-200">
            <span>{relativeTime}</span>
            <span className="inline-flex items-center gap-1">
              <span>❤</span>
              {likesCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
