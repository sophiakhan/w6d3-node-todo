
var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoButton = document.querySelector('#todoButton')
var todoCategory = document.querySelector('#category-list')
var dueDate = document.querySelector('#dueDate')

getTodos()

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function addTodo() {
    var todoTask = todoItem.value
    var addCategory = todoCategory.value
    var addDueDate = dueDate.value

    var body = {
        todo: todoTask,
        completed: false,
        category: addCategory,
        due_date: addDueDate
    }

    fetch('http://localhost:3000/api/v1/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(showTodo)
}

function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(res => res.json())
    .then(loopTodos)
}

function loopTodos(todos) {
    todosContainer.innerHTML = ''
    todos.forEach(showTodo)
}

function showTodo(todo) {
    var todoTemplate = `<li class="list-group-item">
        <input type="checkbox" id="checkbox" value="checkbox">
        ${todo.todo}
            <span class="badge" id="category-item">${todo.category}</span>
            <span class="badge" id="dueDate-item">${todo.due_date}</span>
       
    </li>`
    todosContainer.innerHTML = todoTemplate + todosContainer.innerHTML
}