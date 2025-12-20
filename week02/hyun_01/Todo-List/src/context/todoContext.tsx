import {
    createContext,
    PropsWithChildren,
    ReactNode,
    useContext,
    useState,
} from 'react';
import { Todo } from '../types/todo';

interface ITodoContext {
    todos: Todo[];
    doneTodos: Todo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: Todo) => void;
    deleteTodo: (todo: Todo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: Todo = { id: Date.now(), text };
        setTodos((prevTodos): Todo[] => [...prevTodos, newTodo]);
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
        <TodoContext.Provider
            value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
        >
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = (): ITodoContext => {
    const context = useContext(TodoContext);

    if (!context) {
        throw new Error(
            'useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다.'
        );
    }

    return context;
};
