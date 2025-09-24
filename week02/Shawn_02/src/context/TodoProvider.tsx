import { createContext, useContext, useState } from "react";
import type { Todo } from "../types/Todo";

interface TodoContextType {
    todos: Todo[]
    setTodos: (todos: Todo[]) => void
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined)

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([])

    return (
        <TodoContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodoContext.Provider>
    )
}

export const useTodoContext = () => {
    const context = useContext(TodoContext)
    if (!context) {
        throw new Error('TodoContext must be used within a TodoProvider')
    }
    return context
}
