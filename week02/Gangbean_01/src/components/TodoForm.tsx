import { useState, type FormEvent } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoForm = () => {
    const { addTodo } = useTodo();
    const [input, setInput] = useState<string>('');

    const handleSubmit = (
        e: FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            addTodo(text);
            setInput('');
        }
    };

    return (
        <form
            className='todo-container__form'
            onSubmit={handleSubmit}
        >
            <input
                value={input}
                onChange={(e): void =>
                    setInput(e.target.value)
                }
                className='todo-container__input'
                placeholder='할 일 입력'
                required
            />
            <button
                className='todo-container__button'
                type='submit'
            >
                할 일 추가
            </button>
        </form>
    );
};

export default TodoForm;
