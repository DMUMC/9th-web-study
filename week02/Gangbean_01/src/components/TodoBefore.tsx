import { useState, type FormEvent } from 'react';
import type { TTodo } from '../types/todo';

const TodoBefore = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (
        e: FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = {
                id: Date.now(),
                text: text,
            };
            setTodos((prev): TTodo[] => [...prev, newTodo]);
            setInput('');
        }
    };

    const handleCompleteTodo = (todo: TTodo): void => {
        setTodos((prev) =>
            prev.filter((t) => t.id !== todo.id)
        );
        setDoneTodos((prev) => [...prev, todo]);
    };

    const handleDeleteTodo = (todo: TTodo): void => {
        setDoneTodos((prev) =>
            prev.filter((t) => t.id !== todo.id)
        );
    };

    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>
                GANGBEAN TODO
            </h1>
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
            <div className='render-container'>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>
                        할 일
                    </h2>
                    <ul
                        id='todo-list'
                        className='render-container__list'
                    >
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className='render-container__item'
                            >
                                <span className='render-container__item-text'>
                                    {todo.text}
                                </span>
                                <button
                                    onClick={() =>
                                        handleCompleteTodo(
                                            todo
                                        )
                                    }
                                    className='render-container__item-button'
                                    style={{
                                        backgroundColor:
                                            '#28a745',
                                    }}
                                >
                                    완료
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>
                        완료
                    </h2>
                    <ul
                        id='todo-list'
                        className='render-container__list'
                    >
                        {doneTodos.map((doneTodo) => (
                            <li
                                key={doneTodo.id}
                                className='render-container__item'
                            >
                                <span className='render-container__item-text'>
                                    {doneTodo.text}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDeleteTodo(
                                            doneTodo
                                        )
                                    }
                                    className='render-container__item-button'
                                    style={{
                                        backgroundColor:
                                            '#dc3545',
                                    }}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TodoBefore;
