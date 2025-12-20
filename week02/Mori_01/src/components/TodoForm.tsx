import { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';

const TodoForm = () => {
  const { handleAddTask } = useTodos();
  const [inputText, setInputText] = useState<string>('');

  const handleAction = () => {
    const text = inputText.trim();
    if (text) {
      handleAddTask(text);
      setInputText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAction();
    }
  };

  return (
    <div className="todo-container__form">
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일을 입력해주세요"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        required
      />
      <button
        type="button"
        className="todo-container__button"
        onClick={handleAction}
      >
        할 일 추가
      </button>
    </div>
  );
};

export default TodoForm;