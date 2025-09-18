// 1. HTML 요소 선택 (핸드북 자바스크립트 편 참고)
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 2. 할 일이 어떻게 생겼는지 Type을 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => {
    // 기존 목록 초기화
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    // 할 일 목록 렌더링
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo, false);
        todoList.appendChild(todoElement);
    });

    // 완료된 할 일 목록 렌더링
    doneTasks.forEach(todo => {
        const doneElement = createTodoElement(todo, true);
        doneList.appendChild(doneElement);
    });
};

// 3. 할 일 텍스트 입력 처리 함수. (공백 잘라줌)
const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};

// 5. 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};

// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo : Todo): void =>{
    // doneTasks 배열에서 해당 할 일 삭제
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
}

// 7. HTML 요소 생성 함수 (반환 타입 수정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add("render-container__item");
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add("render-container__item-button");
    if(isDone){
        button.textContent= "삭제";
        button.style.backgroundColor = "#dc3545"
    }else{
        button.textContent= "완료";
        button.style.backgroundColor = "#28a745"
    }
    button.addEventListener('click',():void=>{
        if(isDone){
            deleteTodo(todo);
        }else{
            completeTodo(todo);
        }
    })
    li.appendChild(button);
    return li;
}


// 8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit',(event: Event)=>{
    event.preventDefault();
    const text = getTodoText();
    if(text){
        addTodo(text);
    }
})

renderTasks();