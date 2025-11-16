import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import { ImageUpload } from "./ImageUpload"
import { TagInput } from "./TagInput"
import { useModalOutsideClick } from "../hooks/useModalOutsideClick"

interface CreateLpModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    content: string
    thumbnail: string | null
    tags: string[]
  }) => void
  isSubmitting?: boolean
}

export const CreateLpModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }: CreateLpModalProps) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const modalRef = useModalOutsideClick(isOpen, onClose)

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setTitle("")
      setContent("")
      setTags([])
      setThumbnailUrl(null)
    }
  }, [isOpen])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isUploading) {
      alert("이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    if (isSubmitting) {
      return
    }

    onSubmit({
      title,
      content,
      thumbnail: thumbnailUrl,
      tags,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-lg bg-[#202020] p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="모달 닫기"
        >
          <FiX size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">새 LP 작성</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ImageUpload
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="lp-name" className="text-sm font-semibold text-gray-300">
              LP Name
            </label>
            <input
              id="lp-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 이름을 입력하세요"
              className="rounded-md border border-gray-600 bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#ff00b3] focus:outline-none focus:ring-1 focus:ring-[#ff00b3]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lp-content" className="text-sm font-semibold text-gray-300">
              LP Content
            </label>
            <textarea
              id="lp-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP 내용을 입력하세요"
              rows={6}
              className="resize-none rounded-md border border-gray-600 bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#ff00b3] focus:outline-none focus:ring-1 focus:ring-[#ff00b3]"
              required
            />
          </div>

          <TagInput tags={tags} onChange={setTags} />

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-600 bg-transparent px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-[#2a2a2a]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="rounded-md bg-[#ff00b3] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#b3007d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "업로드 중..." : isSubmitting ? "작성 중..." : "작성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

