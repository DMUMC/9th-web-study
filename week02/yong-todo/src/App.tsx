import "./App.css";
import { TodoProvider } from "./context/TodoContext";
import TodoForm from "./components/TodoForm";
import Board from "./components/Board";

export default function App() {
  return (
    <div className="page">
      <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>

        {/* ⬇️ 여기서 전역 상태 공급 */}
        <TodoProvider>
          {/* ⬇️ 이제 아래 컴포넌트들은 props 없이도 공통 상태 접근 */}
          <TodoForm />
          <Board />
        </TodoProvider>
      </div>
    </div>
  );
}


