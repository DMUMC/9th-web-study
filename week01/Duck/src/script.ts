const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 타입 정의
type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 할 일 렌더링
const renderTask = (): void => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo): void => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });

  doneTasks.forEach((todo): void => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
};

// 할 일 텍스트 입력
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 할 일 추가
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = "";
  renderTask();
};

// 상태 변경
const compleTodo = (todo: Todo): void => {
  todos = todos.filter((item): boolean => item.id !== todo.id);
  doneTasks.push(todo);
  renderTask();
};

// 할 일 삭제
const deleteTodo = (todo: Todo): void => {
  doneTasks = doneTasks.filter((item): boolean => item.id !== todo.id);
  renderTask();
};

// 할 일 아이템 생성
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
  const li = document.createElement("li");
  li.classList.add("render-container__item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("render-container__item-button");

  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }

  button.addEventListener("click", (): void => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      compleTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

// 이벤트 리스너
todoForm.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});

renderTask();
