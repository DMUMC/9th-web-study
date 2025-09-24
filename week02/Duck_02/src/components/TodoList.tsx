import type { TTodo } from "../types/todo";

interface TodoListProps {
  title: string;
  todos?: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick?: (todo: TTodo) => void;
}

const TodoList = ({
  title,
  todos,
  buttonLabel,
  buttonColor,
  onClick,
}: TodoListProps) => {
  return (
    <section className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id="todo-list" className="render-container__list">
        {todos?.map((todos: TTodo) => (
          <li key={todos.id} className="render-container__item">
            <span className="render-container__item-text">{todos.text}</span>
            <button
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
              onClick={(): void => onClick?.(todos)}
            >
              {buttonLabel}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
