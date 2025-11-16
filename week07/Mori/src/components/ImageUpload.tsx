import { useState, useRef } from "react"
import { FiPlus } from "react-icons/fi"
import { uploadImage } from "../apis/lp"

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  isUploading: boolean
  onUploadingChange: (uploading: boolean) => void
}

export const ImageUpload = ({
  value,
  onChange,
  isUploading,
  onUploadingChange,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 미리보기 표시
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // 이미지 업로드
    onUploadingChange(true)
    try {
      const response = await uploadImage(file)
      onChange(response.data.imageUrl)
    } catch (error) {
      console.error("이미지 업로드 실패:", error)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      onUploadingChange(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-300">이미지</label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-[#1a1a1a] text-gray-400 transition-colors hover:border-[#ff00b3] hover:text-[#ff00b3]"
        >
          {preview ? (
            <img
              src={preview}
              alt="썸네일 미리보기"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FiPlus size={32} />
              <span className="text-xs">이미지 추가</span>
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
        {value && (
          <>
            {isUploading && <span className="text-sm text-gray-400">업로드 중...</span>}
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-gray-400 hover:text-white"
              disabled={isUploading}
            >
              이미지 제거
            </button>
          </>
        )}
      </div>
    </div>
  )
}

