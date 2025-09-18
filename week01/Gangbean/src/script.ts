const todoInput = document.getElementById(
    'todo-input'
) as HTMLInputElement;
const todoForm = document.getElementById(
    'todo-form'
) as HTMLFormElement;
const todoList = document.getElementById(
    'todo-list'
) as HTMLUListElement;
const doneList = document.getElementById(
    'done-list'
) as HTMLUListElement;

type Task = {
    id: number;
    text: string;
};

let todos: Task[] = [];
let doneTasks: Task[] = [];

const getTodoText = (): string => {
    return todoInput.value.trim();
};

const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    console.log(todos);
    todoInput.value = '';
    TaskList();
};

const completeTask = (task: Task): void => {
    todos = todos.filter((t) => t.id !== task.id);
    doneTasks.push(task);
    TaskList();
};

const deleteTask = (task: Task): void => {
    doneTasks = doneTasks.filter((t) => t.id !== task.id);
    TaskList();
};

const createTaskElement = (
    task: Task,
    isDone: boolean
): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('todo-board__item');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.classList.add('todo-board__item-text');

    const button = document.createElement('button');
    button.classList.add('todo-board__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#EB5757';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#2F80ED';
    }

    button.addEventListener('click', () => {
        if (isDone) {
            deleteTask(task);
        } else {
            completeTask(task);
        }
    });

    li.appendChild(span);
    li.appendChild(button);

    return li;
};

const TaskList = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((task) => {
        const li = createTaskElement(task, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((task) => {
        const li = createTaskElement(task, true);
        doneList.appendChild(li);
    });
};

todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

TaskList();
