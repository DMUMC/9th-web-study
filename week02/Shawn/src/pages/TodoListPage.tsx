import { useState } from 'react'
import type { Todo } from '../types/Todo'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'

function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([])

  return (
    <>
    <div className="todo-container">
      <h1 className="todo-container__header">Shawn's TODO List</h1>
        <TodoForm todos={todos} setTodos={setTodos} />
        <div className="render-container">
          <TodoList todos={todos} setTodos={setTodos} isDone={false} title="할 일" buttonColor="#28a745" buttonText="완료" />
          <TodoList todos={todos} setTodos={setTodos} isDone={true} title="완료" buttonColor="#dc3545" buttonText="삭제" />
        </div>
      </div>
    </>
  )
}

export default TodoListPage