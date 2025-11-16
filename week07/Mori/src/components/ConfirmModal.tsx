import { FiX } from "react-icons/fi"
import { useModalOutsideClick } from "../hooks/useModalOutsideClick"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "default"
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
}: ConfirmModalProps) => {
  const modalRef = useModalOutsideClick(isOpen, onClose)

  if (!isOpen) return null

  const confirmButtonClass =
    variant === "danger"
      ? "rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700"
      : "rounded-md bg-[#ff00b3] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#b3007d]"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-[#202020] p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="모달 닫기"
        >
          <FiX size={24} />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <p className="mb-6 text-gray-300">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-600 bg-transparent px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-[#2a2a2a]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmButtonClass}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

