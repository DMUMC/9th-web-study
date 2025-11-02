import './App.css'
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  const handleIncreaseNumber = () => {
    // setCount(count + 1) 
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)
    //함수가 실행될 때의 변수 환경(Lexical Environment)을 기억하기 때문에 같은 값이 계속 들어감 

    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  return (
     <>
      <h1>{count}</h1>
      <button onClick={handleIncreaseNumber}>숫자 증가</button>
     </>
  )
}

export default App