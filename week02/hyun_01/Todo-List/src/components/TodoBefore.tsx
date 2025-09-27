import React, { FormEvent } from 'react';
import { useState } from 'react';
import type { Todo } from '../types/todo';

const TodoBefore = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [doneTodos, setDoneTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();
        if (text) {
            const newTodo: Todo = { id: Date.now(), text };
            setTodos((prevTodos): Todo[] => [...prevTodos, newTodo]);
            setInput('');
        }
    };

    const completeTodo = (todo: Todo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };
    const deleteTodo = (todo: Todo) => {
        setDoneTodos((prevDoneTodos) =>
            prevDoneTodos.filter((t) => t.id !== todo.id)
        );
    };
    return (
        <div className="todo-container">
            <h1 className="todo-container__header">YONG TODO</h1>
            <form onSubmit={handleSubmit} className="todo-container__form">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    className="todo-container__input"
                    placeholder="할 일 입력"
                    required
                />
                <button type="submit" className="todo-container__button">
                    할 일 추가
                </button>
            </form>

            <div className="render-container">
                <div className="render-container__section">
                    <h2 className="render-container__title">할 일</h2>
                    <ul id="todo-list" className="render-container__list">
                        {todos.map(
                            (todo): React.ReactElement => (
                                <li
                                    key={todo.id}
                                    className="render-container__item"
                                >
                                    <span className="render-container__item-text">
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => completeTodo(todo)}
                                        style={{ backgroundColor: '#28a745' }}
                                        className="render-container__item-button"
                                    >
                                        완료
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                <div className="render-container__section">
                    <h2 className="render-container__title">완료</h2>
                    <ul id="todo-list" className="render-container__list">
                        {doneTodos.map(
                            (todo): React.ReactElement => (
                                <li
                                    key={todo.id}
                                    className="render-container__item"
                                >
                                    <span className="render-container__item-text">
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo)}
                                        style={{ backgroundColor: '#dc3545' }}
                                        className="render-container__item-button"
                                    >
                                        완료
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TodoBefore;
