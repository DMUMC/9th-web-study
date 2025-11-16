import { useState } from "react"
import { FiX } from "react-icons/fi"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export const TagInput = ({ tags, onChange }: TagInputProps) => {
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="lp-tag" className="text-sm font-semibold text-gray-300">
        LP Tag
      </label>
      <div className="flex gap-2">
        <input
          id="lp-tag"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="태그를 입력하세요"
          className="flex-1 rounded-md border border-gray-600 bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#ff00b3] focus:outline-none focus:ring-1 focus:ring-[#ff00b3]"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="rounded-md bg-[#ff00b3] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#b3007d]"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-3 py-1 text-sm text-white"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full p-1 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white"
                aria-label={`${tag} 태그 제거`}
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

