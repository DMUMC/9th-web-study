import { useTodos } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

interface TodoListProps {
  listType: 'todos' | 'done';
}

const TodoList = ({ listType }: TodoListProps) => {
  const { todos, doneTasks, completeTask, deleteTodo } = useTodos();

  const listConfig = {
    todos: {
      title: '할 일',
      tasks: todos,
      actionLabel: '완료',
      onAction: completeTask,
    },
    done: {
      title: '완료',
      tasks: doneTasks,
      actionLabel: '삭제',
      onAction: deleteTodo,
    },
  };
  
  const { title, tasks, actionLabel, onAction } = listConfig[listType];

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {tasks.length === 0 && title === '할 일' ? (
          <li className='render-container__list-nothing'>비어있어요!</li>
        ) : (
          tasks.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onAction={onAction}
              actionLabel={actionLabel}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;