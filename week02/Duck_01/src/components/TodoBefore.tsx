import { useState } from "react";
import type { TTodo } from "../types/todo";
const TodoBefore = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo: TTodo = {
        id: Date.now(),
        text,
      };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput("");
    }
  };

  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos): TTodo[] =>
      prevTodos.filter((t): boolean => t.id !== todo.id)
    );
    setDoneTodos((prevDonetTodos): TTodo[] => [...prevDonetTodos, todo]);
  };

  const deleteTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodos) =>
      prevDoneTodos.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">Duck TODO</h1>
      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          required
          value={input}
          onChange={(e): void => setInput(e.target.value)}
        />
        <button className="todo-container__button">할 일 추가</button>
      </form>
      <div className="render-container">
        <section className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  style={{ backgroundColor: "#28a745" }}
                  className="render-container__item-button"
                  onClick={(): void => completeTodo(todo)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="render-container__section">
          <h2 className="render-container__title">삭제</h2>
          <ul id="todo-list" className="render-container__list">
            {doneTodos.map((done) => (
              <li key={done.id} className="render-container__item">
                <span className="render-container__item-text">{done.text}</span>
                <button
                  style={{ backgroundColor: "red" }}
                  className="render-container__item-button"
                  onClick={(): void => deleteTodo(done)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TodoBefore;
