// src/contexts/TodoContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Task = { id: number; text: string };

type TodoContextValue = {
  input: string;
  setInput: (v: string) => void;

  todos: Task[];
  doneTasks: Task[];

  add: () => void;                // input → todos
  complete: (id: number) => void; // todos → doneTasks
  remove: (id: number) => void;   // doneTasks 에서 삭제
  clearAll: () => void;           // (옵션) 모두 초기화
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const add = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const newTask: Task = { id: Date.now(), text };
    setTodos(prev => [newTask, ...prev]);
    setInput("");
  }, [input]);

  const complete = useCallback((id: number) => {
    setTodos(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev; // 없으면 무시
      // 삭제 + done으로 이동
      setDoneTasks(d => [target, ...d]);
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const remove = useCallback((id: number) => {
    setDoneTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTodos([]);
    setDoneTasks([]);
    setInput("");
  }, []);

  // 함수 레퍼런스가 안정적으로 유지되므로 value도 메모
  const value = useMemo(
    () => ({
      input,
      setInput,
      todos,
      doneTasks,
      add,
      complete,
      remove,
      clearAll,
    }),
    [input, todos, doneTasks, add, complete, remove, clearAll]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo는 <TodoProvider> 내부에서만 사용할 수 있어요.");
  return ctx;
}

