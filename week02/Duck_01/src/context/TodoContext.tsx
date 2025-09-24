import type { TTodo } from "../types/todo";
import { useState, type PropsWithChildren } from "react";
import { createContext } from "react";
import { useContext } from "react";

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
  addTodo: (text: string) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren): Element => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string): void => {
    const newTodo: TTodo = {
      id: Date.now(),
      text,
    };
    setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
  };

  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos): TTodo[] =>
      prevTodos.filter((t): boolean => t.id !== todo.id)
    );
    setDoneTodos((prevDonetTodos): TTodo[] => [...prevDonetTodos, todo]);
  };

  const deleteTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodos) =>
      prevDoneTodos.filter((t): boolean => t.id !== todo.id)
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
  //컨택스트가 없는 경우
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  // 컨택스트가 있는 경우
  return context;
};
