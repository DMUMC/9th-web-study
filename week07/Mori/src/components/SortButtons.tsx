import type { LpOrder } from "../types/lp"

interface SortButtonsProps {
  order: LpOrder
  onChangeOrder: (order: LpOrder) => void
}

export const SortButtons = ({ order, onChangeOrder }: SortButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChangeOrder("asc")}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
          order === "asc"
            ? "bg-[#ff00b3] text-white"
            : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2d2d2d]"
        }`}
      >
        오래된순
      </button>
      <button
        type="button"
        onClick={() => onChangeOrder("desc")}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
          order === "desc"
            ? "bg-[#ff00b3] text-white"
            : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2d2d2d]"
        }`}
      >
        최신순
      </button>
    </div>
  )
}

