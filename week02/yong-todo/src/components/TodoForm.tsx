import type { FormEvent } from "react";
import { useTodo } from "../context/TodoContext";

export default function TodoForm() {
  const { input, setInput, add } = useTodo();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    add();
  };

  return (
    <form id="todo-form" className="todo-container__form" onSubmit={onSubmit}>
      <input
        type="text"
        id="todo-input"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        required
      />
      <button type="submit" className="todo-container__button" disabled={!input.trim()}>
        할 일 추가
      </button>
    </form>
  );
}




