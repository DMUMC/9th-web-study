import './App.css'
import { useThemeContext } from './context/ThemeProvider'
import TodoListPage from './pages/TodoListPage'

function App() {
  const { theme } = useThemeContext()
  return (
    <div className={`flex justify-center items-center w-full h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900 text-gray-100'}`}>
      <TodoListPage />
    </div>
  )
}

export default App