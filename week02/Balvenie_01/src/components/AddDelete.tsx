import { useCallback, useState, useMemo, FormEvent, ChangeEvent, JSX } from "react";

const AddDelete: React.FC = () => {
    const getTodoText = useCallback((): string => {
        return input.trim();
    },[input]);

    const addTodo = useCallback((text: string): void => {
        setTodo((prev) => [...prev, { id: Date.now(), text }]);
        setInput("");
    }, []);

    const deleteTask = useCallback((task: Task): void => {
        setDoneTask((prev) => prev.filter((t) => t.id !== task.id));
    }, []);
}