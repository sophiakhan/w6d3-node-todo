
var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoButton = document.querySelector('#todoButton')
var todoCategory = document.querySelector('#category-list')
var dueDate = document.querySelector('#dueDate')
var datePickerUI 

getTodos()

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)


datePickerUI = new Pikaday({
    field: document.getElementById('dueDate'),
});


todosContainer.addEventListener('click', handleClickOnCheckbox)

// functions

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function handleClickOnCheckbox(e) {
    if (e.target.type === 'checkbox') {
        toggleTodoComplete(e.target.dataset.id, e.target.checked)
    }
}

function toggleTodoComplete(todoId, isComplete) {
    if (isComplete) {
        fetch('/api/v1/todos/' + todoId + '/complete')
        .then(res => res.json())
    }
    
    else {
        fetch('/api/v1/todos/' + todoId + '/incomplete')
        .then(res => res.json())
    }

}

function addTodo() {
    var todoTask = todoItem.value.trim()
    var addCategory = todoCategory.value.trim()
    var addDueDate = dueDate.value.trim()

    if (todoTask !== '' && addCategory !== '' && addDueDate !== '') {

        todoItem.value = ''
        todoCategory.value = ''
        dueDate.value = ''

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

    else {
        alert('Requires task, category, and due date for take off!')
    }
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
    var badgeColor;

    switch(todo.category) {
        case 'Space Supplies':
            badgeColor = 'supplies-color';
            break;
        case 'Mission Control':
            badgeColor = 'mission-color';
            break;
        case 'Engine Check':
            badgeColor = 'engine-color';
            break;
        case 'Take Off':
            badgeColor = 'takeoff-color';
            break;
        case 'Spaceship Maintenance':
            badgeColor = 'maintenance-color';
            break;
        case 'Landing':
            badgeColor = 'landing-color';
            break;
    }


    var todoTemplate = `<li class="list-group-item">
        <input type="checkbox" data-id="${todo.id}" ${todo.completed === 'yes' ? 'checked' : ''} />
        ${todo.todo}
            <span class="badge category-item ${badgeColor}">${todo.category}</span>
            <span class="badge dueDate-item">${moment(todo.due_date).format('MM/DD/YYYY')}</span>
       
    </li>`

    todosContainer.innerHTML = todoTemplate + todosContainer.innerHTML;
    
}