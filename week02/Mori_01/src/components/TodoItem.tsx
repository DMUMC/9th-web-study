import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onAction: (todo: Todo) => void;
  actionLabel: string;
}

const TodoItem = ({ todo, onAction, actionLabel }: TodoItemProps) => {

  const buttonColor = actionLabel === '완료' 
    ? '#28a745' 
    : '#dc3545';

  return (
    <li className="render-container__item">
      {todo.text}
      <button
        className='render-container__item-button'
        style={{backgroundColor:buttonColor}}
        onClick={() => onAction(todo)}
      >
        {actionLabel}
      </button>
    </li>
  );
};

export default TodoItem;