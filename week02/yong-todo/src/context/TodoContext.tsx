import { createContext, useContext, useState } from "react";

export type Task = { id: number; text: string };

type TodoContextValue = {
  input: string;
  setInput: (v: string) => void;

  todos: Task[];
  doneTasks: Task[];

  add: () => void;             // input → todos 추가
  complete: (task: Task) => void; // todos → doneTasks 이동
  remove: (task: Task) => void;   // doneTasks 에서 삭제
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const add = () => {
    const text = input.trim();
    if (!text) return;
    const newTask: Task = { id: Date.now(), text };
    setTodos(prev => [newTask, ...prev]);
    setInput("");
  };

  const complete = (task: Task) => {
    setTodos(prev => prev.filter(t => t.id !== task.id));
    setDoneTasks(prev => [task, ...prev]);
  };

  const remove = (task: Task) => {
    setDoneTasks(prev => prev.filter(t => t.id !== task.id));
  };

  const value: TodoContextValue = { input, setInput, todos, doneTasks, add, complete, remove };
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo must be used within <TodoProvider>");
  return ctx;
}
