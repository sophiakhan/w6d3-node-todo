// Variables ---
var todosContainer = document.querySelector('#todos')
var todoTaskInput = document.querySelector('#todoTask')
var todoCategoryInput = document.querySelector('#todoCategory')
var todoDueAtInput = document.querySelector('#todoDueAt')
var todoButton = document.querySelector('#todoButton')


// Logic ---

// Load existing todos
getTodos()

// Make the Pikaday date picker UI control
new Pikaday({ field: todoDueAtInput })

// Handle events for adding a new todo task
todoTaskInput.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)

// Handle event for completing or incompleting a task
// todosContainer.addEventListener('click', handleClickOnCheckbox)

// Put a default due date value
todoDueAtInput.value = moment().add(1, 'day').format('YYYY-MM-DD')

// Initially focus on the task input box so a user can just start typing - no clicking first!
todoTaskInput.focus()


// Functions ---

//  Event handler functions
function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function handleClickOnCheckbox(e) {
    // Only do something if a user clicks on a checkbox input tag
    if (e.target.type === 'checkbox') {
        // Get the data-id attribute that has the current todo item ID
        // Your code goes here...

        // Check to see if the checkbox is checked (returns true if it is, false if it isn't)
        // Your code goes here...

        // Call the toggleTodoComplete function and pass our ID and completion status to it
        toggleTodoComplete(todoId, isComplete)
    }
}

// Toggle todo completion status ('yes' or 'no' in the database table)
function toggleTodoComplete(todoId, isComplete) {

    // Completed tasks call one back-end endpoint
    if (isComplete) {
        fetch('/api/v1/todos/' + todoId +  '/complete')
    }

    // Incomplete tasks call another back-end endpoint
    else {
        // Your code goes here...
    }

}

// Add new todos
function addTodo() {
    // Get trimmed input field values and put them in variables before we clear them out
    var todoTask = todoTaskInput.value.trim()
    var todoCategory = todoCategoryInput.value.trim()
    var todoDueAt = todoDueAtInput.value.trim()

    // Begin form validation check
    if (todoTask !== '' && todoCategory !== '' && todoDueAt !== '') {

        // Clear out or reset fields
        todoTaskInput.value = ''
        todoDueAtInput.value = ''
        todoCategoryInput.value = ''

        // Create our post body object
        var body = {
            todo: todoTask,
            completed: false,
            due_at: todoDueAt,
            category: todoCategory
        }

        // Post the new todo
        fetch('/api/v1/todos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            // When we get a response from fetch, reload the todos on the page so they're sorted properly
            .then(getTodos)

    }
    // End form validation check

    // User failed validation check
    else {
        alert('Category, due date, and task are required.')
        todoCategoryInput.focus()
    }

}

// Load todos array
function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(response => response.json())
    .then(loopTodos)
}

// Loop over todos array
function loopTodos(todos) {
    // Clear out any existing todo items that might be on the page
    todosContainer.innerHTML = ''

    // Loop over the todos array and pass them one at a time to showTodo function
    todos.forEach(showTodo)
}

// Render one todo at a time to the page
function showTodo(todo) {
    // Our single todo item template, each todo item is a single LI tag
    // Note that you can run functions and methods within the ${} template strings
    var todoTemplate = `<li class="list-group-item">
        <div class="row">
            <div class="col-xs-8">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" data-id="${todo.id}" />
                        ${todo.todo}
                    </label>
                </div>
            </div>
            <div class="col-sm-2 text-right">
                <span class="label label-danger">${todo.category.toUpperCase()}</span>
            </div>
            <div class="col-sm-2 text-right">
                <span class="label label-default">${moment(todo.due_at).format('MM/DD/YYYY')}</span>
            </div>
        </div>
    </li>`

    // Concatenate our single todo item template onto the end of the existing todo items on the page
    todosContainer.innerHTML += todoTemplate
}