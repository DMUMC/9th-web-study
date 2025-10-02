import { useState, type FormEvent } from "react";
import { useTodo } from "./TodoContext";

export const TodoForm = () => {
  const [input, setInput] = useState<string>('');
  const {addTodo} = useTodo();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('동작함');
      const text = input.trim();

      if (text) {
          // addTodo
          addTodo(text);
          setInput('');
      }
  };
  return (
    <form onSubmit={handleSubmit} className="todo-container__form">
        <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            id="todo-input"
            className="todo-container__input"
            placeholder="할 일 입력"
            required
        />
        <button type="submit" className="todo-container__button">할 일 추가</button>
    </form>
  )
}
