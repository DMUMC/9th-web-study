import { useTodo } from "../context/TodoContext";
import TaskItem from "./TaskItem";

export default function DoneColumn() {
  const { doneTasks, remove } = useTodo();

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul className="render-container__list">
        {doneTasks.map((task) => (
          <TaskItem
            key={task.id}
            taskText={task.text}
            actionLabel="삭제"
            actionVariant="danger"
            onClick={() => remove(task)}
          />
        ))}
      </ul>
    </div>
  );
}



