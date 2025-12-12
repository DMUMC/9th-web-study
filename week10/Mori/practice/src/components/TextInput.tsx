import { memo } from "react"

interface ITextInput {
  onChange: (text: string) => void
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log('TextInput rendered')

  return (
    <input 
      type="text" 
      className="border p-2 rounded-md" 
      onChange={(e) => onChange(e.target.value)} 
      placeholder="Enter text"
    />
  )
}

export default memo(TextInput)