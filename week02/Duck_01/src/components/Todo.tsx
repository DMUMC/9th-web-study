import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useTodo } from "../context/TodoContext";

const Todo = () => {
  const { state, dispatch } = useTodo();

  const handleComplete = (id: number) => {
    dispatch({ type: 'COMPLETE', id });
  };

  const handleDelete = (id: number) => {
    dispatch({ type: 'DELETE', id });
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">Duck</h1>
      <TodoForm />
      <div className="render-container">
        <TodoList
          title="할 일"
          todos={state.todos}
          buttonLabel="완료"
          buttonColor="#28a745"
          onClick={handleComplete}
        />
        <TodoList
          title="완료"
          todos={state.done}
          buttonLabel="삭제"
          buttonColor="#dc3545"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default Todo;
