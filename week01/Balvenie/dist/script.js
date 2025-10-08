"use strict";
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
let todos = [];
let doneTasks = [];
function renderTask() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
}
function getTodoText() {
    return todoInput.value.trim();
}
function addTodo(text) {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTask();
}
function completeTodo(todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    doneTasks.push(todo);
    renderTask();
}
function deleteTodo(todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTask();
}
function createTodoElement(todo, isDone) {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;
    const button = document.createElement('button');
    button.classList.add('render-container__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', function () {
        if (isDone) {
            deleteTodo(todo);
        }
        else {
            completeTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
}
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
