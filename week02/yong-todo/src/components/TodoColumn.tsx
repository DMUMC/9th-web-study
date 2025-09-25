import { useTodo } from "../context/TodoContext";
import TaskItem from "./TaskItem";

export default function TodoColumn() {
  const { todos, complete } = useTodo();

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul className="render-container__list">
        {todos.map((task) => (
          <TaskItem
            key={task.id}
            taskText={task.text}
            actionLabel="완료"
            actionVariant="success"
            onClick={() => complete(task)}
          />
        ))}
      </ul>
    </div>
  );
}



