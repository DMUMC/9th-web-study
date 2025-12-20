import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">MORI TODO</h1>
      <TodoForm />
      <div className="render-container">
        <TodoList listType="todos" />
        <TodoList listType="done" />
      </div>
    </div>
  );
}

export default App;