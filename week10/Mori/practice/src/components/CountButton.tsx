import { memo } from "react"

interface ICountButton {
  onClick: (count: number) => void
}

const CountButton = ({ onClick }: ICountButton) => {
  console.log('CountButton rendered')

  return (
    <button className="border p-2 rounded-md" onClick={() => onClick(1)}>Increase Count</button>
  )
}

export default memo(CountButton)