import './App.css'
import Todo from './compoenents/Todo'
import { TodoProvider } from './compoenents/TodoContext'

function App() {

  return (
    <>
      <TodoProvider>
        <Todo />
      </TodoProvider>
    </>
  )
}

export default App
