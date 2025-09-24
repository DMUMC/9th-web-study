import { useState } from "react"
import { useTodoContext } from "../context/TodoProvider"

export const TodoForm = () => {
    const context = useTodoContext()
    const [input, setInput] = useState<string>('')

    const handleAddTodo = () => {
        // 기존 todos 배열에 새로운 할 일 객체를 추가
        // id는 현재 todos 배열의 길이 + 1로 설정하여 고유값 생성
        // isDone은 false로 초기화 (새로 추가된 할 일은 미완료 상태)
        context.setTodos([...context.todos, { id: context.todos.length + 1, text: input, isDone: false }])
        // 할 일 추가 후 입력 필드를 비워서 다음 입력을 위해 준비
        setInput('')
    }

    return (
        <form id="todo-form" className="todo-container__form">
          <input
            type="text"
            id="todo-input"
            className="todo-container__input"
            placeholder="할 일 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="button" className="todo-container__button" onClick={handleAddTodo}>할 일 추가</button>
        </form>
    )
}