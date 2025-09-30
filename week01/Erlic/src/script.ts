// ★ Node 모듈 임포트 삭제 ★

// 1. html 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm  = document.getElementById('todo-form')  as HTMLFormElement;
const todoList  = document.getElementById('todo-list')  as HTMLUListElement;
const doneList  = document.getElementById('done-list')  as HTMLUListElement;

// 2. 타입
type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 렌더링
const renderTasks = (): void => {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.forEach((todo) => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });

  doneTasks.forEach((todo) => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
};

// 입력 처리
const getTodoText = (): string => todoInput.value.trim();

// 추가
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = '';
  renderTasks();
};

// 완료로 이동
const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t) => t.id !== todo.id); // ← 수정
  doneTasks.push(todo);
  renderTasks();
};

// 완료 항목 삭제
const deleteTodo = (todo: Todo): void => {
  doneTasks = doneTasks.filter((t) => t.id !== todo.id); // ← 수정
  renderTasks();
};

// 아이템 생성
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
  const li = document.createElement('li');
  li.classList.add('render-container_item');
  li.textContent = todo.text;

  const button = document.createElement('button');
  button.classList.add('render-container_item-button');
  if (isDone) {
    button.textContent = '삭제';
    button.style.backgroundColor = '#dc3545';
  } else {
    button.textContent = '완료';
    button.style.backgroundColor = '#28a745';
  }

  button.addEventListener('click', () => {
    if (isDone) deleteTodo(todo);
    else completeTodo(todo);
  });

  li.appendChild(button);
  return li;
};

// 폼 제출
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = getTodoText();
  if (text) addTodo(text);
});

renderTasks();
