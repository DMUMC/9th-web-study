import type { Todo } from '../types/Todo'

interface TodoListProps {
    todos: Todo[]
    setTodos: (todos: Todo[]) => void
    isDone?: boolean
    title: string
    buttonColor: string
    buttonText: string
}

export const TodoList = ({ todos, setTodos, isDone, title, buttonColor, buttonText }: TodoListProps) => {

    const handleClick = (id: number) => {
        if (isDone) {
            // 해당 할 일을 목록에서 완전히 삭제
            setTodos(todos.filter((todo) => todo.id !== id))
        } else {
            // 해당 할 일의 isDone 상태를 true로 변경하여 완료 처리
            setTodos(todos.map((todo) => todo.id === id ? { ...todo, isDone: true } : todo))
        }
    }
    return (
        <div className="render-container__section">
            <h2 className="render-container__title">
                {title}
            </h2>
            <ul id="todo-list" className="render-container__list">
              {todos.filter((todo) => todo.isDone === isDone).map((todo) => (
                <li className='render-container__item' key={todo.id}>{todo.text}
                  <button className='render-container__item-button'
                  style={{ backgroundColor: buttonColor }}
                  onClick={() => handleClick(todo.id)}>{buttonText}</button>
                </li>
              ))}
            </ul>
          </div>
    )
}