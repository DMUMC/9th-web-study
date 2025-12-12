import { useCallback, useState } from "react"
import CountButton from "./components/CountButton"
import TextInput from "./components/TextInput"

export default function UseCallbackPage() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  const handleIncreaseCount = useCallback((number: number) => {
    setCount(count + number)
  }, [count])

  const handleText = useCallback((text: string) => {
    setText(text)
  }, [])

  return (
    <div>
      <h2>Count: {count}</h2>
      <CountButton onClick={handleIncreaseCount} />
      <h2>Text</h2>
      <div className="flex flex-col">
        <span>{text}</span>
        <TextInput onChange={handleText} />
      </div>
    </div>
  )
}