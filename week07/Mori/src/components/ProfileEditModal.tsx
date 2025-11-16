import { useState, useEffect, useRef } from "react"
import { FiX, FiPlus } from "react-icons/fi"
import { useModalOutsideClick } from "../hooks/useModalOutsideClick"
import { uploadImage } from "../apis/lp"
import type { ResponseMyInfoDto } from "../types/auth"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    bio: string | null
    avatar: string | null
  }) => void
  initialData: ResponseMyInfoDto["data"] | null
}

export const ProfileEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProfileEditModalProps) => {
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useModalOutsideClick(isOpen, onClose)

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name)
      setBio(initialData.bio || "")
      setAvatarUrl(initialData.avatar)
      setAvatarPreview(initialData.avatar)
      setAvatar(null)
    }
  }, [initialData, isOpen])

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setName("")
      setBio("")
      setAvatar(null)
      setAvatarUrl(null)
      setAvatarPreview(null)
    }
  }, [isOpen])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 미리보기 표시
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // 이미지 업로드
    setIsUploading(true)
    try {
      const response = await uploadImage(file)
      setAvatarUrl(response.data.imageUrl)
      setAvatar(file)
    } catch (error) {
      console.error("이미지 업로드 실패:", error)
      setAvatarPreview(avatarUrl)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarUrl(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    
    if (isUploading) {
      alert("이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.")
      return
    }

    onSubmit({
      name: name.trim(),
      bio: bio.trim() || null,
      avatar: avatarUrl,
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

        <h2 className="mb-6 text-2xl font-bold text-white">프로필 수정</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 프로필 사진 업로드 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">프로필 사진</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-600 bg-[#1a1a1a] text-gray-400 transition-colors hover:border-[#ff00b3] hover:text-[#ff00b3] overflow-hidden"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="프로필 미리보기"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FiPlus size={32} />
                    <span className="text-xs">사진 추가</span>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {avatarPreview && (
                <>
                  {isUploading && <span className="text-sm text-gray-400">업로드 중...</span>}
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-sm text-gray-400 hover:text-white"
                    disabled={isUploading}
                  >
                    사진 제거
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-name" className="text-sm font-semibold text-gray-300">
              이름 <span className="text-red-400">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="rounded-md border border-gray-600 bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#ff00b3] focus:outline-none focus:ring-1 focus:ring-[#ff00b3]"
              required
            />
          </div>

          {/* 소개 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-bio" className="text-sm font-semibold text-gray-300">
              소개
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개를 입력하세요 (선택사항)"
              rows={4}
              className="resize-none rounded-md border border-gray-600 bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#ff00b3] focus:outline-none focus:ring-1 focus:ring-[#ff00b3]"
            />
          </div>

          {/* 제출 버튼 */}
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
              disabled={isUploading}
              className="rounded-md bg-[#ff00b3] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#b3007d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "업로드 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

