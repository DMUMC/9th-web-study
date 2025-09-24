import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'
import { useThemeContext } from '../context/ThemeProvider'
import clsx from 'clsx'

function TodoListPage() {
  const { theme, setTheme } = useThemeContext()

  const handleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
    <div className={clsx('todo-container', theme === 'light' ? 'bg-gray-100' : 'bg-gray-700 text-gray-100')}>
      <h1 className="todo-container__header">Shawn's TODO List</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList isDone={false} title="할 일" buttonColor="#28a745" buttonText="완료" />
          <TodoList isDone={true} title="완료" buttonColor="#dc3545" buttonText="삭제" />
        </div>
        <button className={`mt-2 px-3 py-2 rounded-xl ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`} onClick={handleTheme}>{theme === 'light' ? '다크 모드' : '라이트 모드'}</button>
      </div>
    </>
  )
}

export default TodoListPage