import { useTodoContext } from '../context/TodoProvider'

interface TodoListProps {
    isDone?: boolean
    title: string
    buttonColor: string
    buttonText: string
}

export const TodoList = ({ isDone, title, buttonColor, buttonText }: TodoListProps) => {
    const context = useTodoContext()

    const handleClick = (id: number) => {
        if (isDone) {
            // 해당 할 일을 목록에서 완전히 삭제
            context.setTodos(context.todos.filter((todo) => todo.id !== id))
        } else {
            // 해당 할 일의 isDone 상태를 true로 변경하여 완료 처리
            context.setTodos(context.todos.map((todo) => todo.id === id ? { ...todo, isDone: true } : todo))
        }
    }
    return (
        <div className="render-container__section">
            <h2 className="render-container__title">
                {title}
            </h2>
            <ul id="todo-list" className="render-container__list">
              {context.todos.filter((todo) => todo.isDone === isDone).map((todo) => (
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