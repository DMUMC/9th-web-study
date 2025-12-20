import { useCallback, useState, useMemo, FormEvent, ChangeEvent, JSX } from "react";

type Task = {
    id: number;
    text: string;
}

const TodoList: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [todo, setTodo] = useState<Task[]>([]);
    const [doneTask, setDoneTask] = useState<Task[]>([]);

    const getTodoText = useCallback((): string => {
        return input.trim();
    },[input]);

    const addTodo = useCallback((text: string): void => {
        setTodo((prev) => [...prev, { id: Date.now(), text }]);
        setInput("");
    }, []);

    const completeTask = useCallback((task: Task): void => {
        setDoneTask((prev) => prev.filter((t) => t.id !== task.id));
    }, []);

    const deleteTask = useCallback((task: Task): void => {
        setDoneTask((prev) => prev.filter((t) => t.id !== task.id));
    }, []);

    const createTaskElement = useCallback(
        (task: Task, isDone: boolean): JSX.Element => {
            const onClick = () => (isDone ? deleteTask(task) : completeTask(task));

            return (
                <li key={task.id} className="render-container__item">
                    <span>{task.text}</span>
                    <button
                        type="button"
                        className="render-container__item-button"
                        style={{
                        backgroundColor: isDone ? "#dc3545" : "#28a745", // 원본 색상 유지
                        marginLeft: "8px",
                        }}
                        onClick={onClick}
                    >
                        {isDone ? "삭제" : "완료"}
                    </button>
                </li>
            );
        },
        [completeTask, deleteTask]
    );

    const todoItems = useMemo(() => todo.map((t) => createTaskElement(t, false)), [todo, createTaskElement]);
    const doneItems = useMemo(() => doneTask.map((t) => createTaskElement(t, true)), [doneTask, createTaskElement]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = getTodoText();
        if (text) addTodo(text);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="render-container">
        {/* 원본의 todo-form, todo-input, todo-list, done-list id는 aria-label로 남겨두거나 필요 시 data-속성으로 보존 */}
        <form aria-label="todo-form" onSubmit={onSubmit} style={{ marginBottom: 12 }}>
            <input
                aria-label="todo-input"
                type="text"
                value={input}
                onChange={onChange}
                placeholder="할 일을 입력하세요"
            />
            <button type="submit" style={{ marginLeft: 8 }}>
            추가
            </button>
        </form>

        <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div>
            <h3>할 일</h3>
            <ul aria-label="todo-list" style={{ paddingLeft: 16 }}>{todoItems}</ul>
            </div>
            <div>
            <h3>완료됨</h3>
            <ul aria-label="done-list" style={{ paddingLeft: 16 }}>{doneItems}</ul>
            </div>
        </section>
        </div>
    );
};

export default TodoList;