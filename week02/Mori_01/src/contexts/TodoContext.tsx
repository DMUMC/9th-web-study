import { createContext, useState, useContext, ReactNode } from 'react';
import type { Todo } from '../types';

interface TodoContextType {
  todos: Todo[];
  doneTasks: Todo[];
  handleAddTask: (text: string) => void;
  completeTask: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);

  const handleAddTask = (text: string): void => {
    const newTodo = { id: Date.now(), text };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const completeTask = (todoToComplete: Todo): void => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoToComplete.id));
    setDoneTasks(prevDoneTasks => [...prevDoneTasks, todoToComplete]);
  };

  const deleteTodo = (todoToDelete: Todo): void => {
    setDoneTasks(prevDoneTasks => prevDoneTasks.filter(todo => todo.id !== todoToDelete.id));
  };

  const value = { todos, doneTasks, handleAddTask, completeTask, deleteTodo };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 반드시 TodoProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};