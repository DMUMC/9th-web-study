import React, { FormEvent, useState } from "react";
import { TTodo } from "../types/todo";
interface TodoFormProps {
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) =>
        void;
}

const TodoForm = ({ input, setInput, handleSubmit } : TodoFormProps) : Element => {

    return (
        <form onSubmit={handleSubmit} className='todo-container__form'>
            <input value={input} onChange={(e) : void => setInput(e.target.value)} type='text' className='todo-container__input' placeholder='할 일 입력' required/>
            <button type='submit' className='todo-container__button'>
                할 일 추가
            </button>
        </form>
    );
}

export default TodoForm;