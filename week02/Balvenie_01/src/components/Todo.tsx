import { FormEvent, useContext, useState } from "react";
import TodoList from "./TodoList";
import { TTodo } from "../types/todo";
import { TodoContext } from "../context/TodoContext";
import TodoForm from "./TodoForm";

const Todo = (): Element => {
    const [input, setInput] = useState<string>('');
    const context = useContext(TodoContext);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            context?.addTodo(text);
            setInput('');
        }
    };

    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>TodoList</h1>
            <TodoForm input={input} setInput={setInput} handleSubmit={handleSubmit}/>
            <div className='render-container'>
                <TodoList
                    title='할 일' 
                    todos={context.todos} 
                    buttonLabel='완료'
                    buttonColor='#28a745'
                    onClick={context.completeTodo}
                />
                <TodoList
                    title='완료' 
                    todos={context.doneTodos} 
                    buttonLabel='삭제'
                    buttonColor='#dc3545'
                    onClick={context.deleteTodo}
                />
            </div>
        </div>
    );
}

export default Todo;