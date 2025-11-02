import './App.css'
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)
  return (
     <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>숫자 증가</button>
      <button onClick={() => setCount(count - 1)}>숫자 감소</button>
      
     </>
  )
}

export default App