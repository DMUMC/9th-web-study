import './App.css'
import Todo from './components/Todo';
import TodoList from './components/TodoLegacy';
import { TodoProvider } from './context/TodoContext';

function App(): Element {
  return (
  <TodoProvider>
    <Todo />
  </TodoProvider>
  );
}

export default App;